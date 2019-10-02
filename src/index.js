const path = require("path");
const fs = require("fs");
const fg = require("fast-glob");

class WebpackExportStatsPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const options = Object.assign(
      {
        patterns: ["**/*.*"],
        exclude: [],
        context: compiler.context,
        output: "graph.json",
        log: "info",
        numberOfMinDeps: 2,
        filterFunc: undefined
      },
      this.options
    );

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync("WebpackExportStatsPlugin", this.handleAfterEmit.bind(this, options));
    } else {
      compiler.plugin(`after-emit`, this.handleAfterEmit.bind(this, options));
    }
  }

  handleAfterEmit(options, compilation, callback) {
    collectExportStats(compilation, options);
    callback();
  }
}

function getPattern({ context, patterns, exclude }) {
  return patterns
    .map(pattern => path.resolve(context, pattern))
    .concat(exclude.map(pattern => `!${pattern}`))
    .map(convertToUnixPath);
}

function collectExportStats(compilation, options) {
  const includedFiles = fg.sync(getPattern(options));
  const projectGraph = buildProjectGraph(compilation, convertFilesToDict(includedFiles), options.filterFunc);
  logProjectGraph(projectGraph, options);
}

function normalizeProjectGraph(projectGraph, options) {
  const graph = {};
  context = convertToUnixPath(options.context);
  projectGraph.forEach((module, path) => {
    path = path.replace(context, "");
    graph[path] = graph[path] || {};
    module.forEach((deps, id) => {
      if (deps.size >= options.numberOfMinDeps) {
        if (options.log === "verbose") {
          graph[path][id] = [...deps].map(dep => dep.replace(context, ""));
        } else {
          graph[path][id] = deps.size;
        }
      }
    });
    if (Object.keys(graph[path]).length === 0) {
      delete graph[path];
    }
  });
  return graph;
}

function logProjectGraph(projectGraph, options) {
  const outputGraph = normalizeProjectGraph(projectGraph, options);
  fs.writeFileSync(options.output, JSON.stringify(outputGraph, null, 2));
}

function buildProjectGraph(compilation, includedFileMap, filterFunc) {
  const projectGraph = new Map();
  compilation.chunks.forEach(function(chunk) {
    for (const module of chunk.modulesIterable) {
      if (!module.resource) continue;

      const modulePath = convertToUnixPath(module.resource);

      if (/^((?!(node_modules)).)*$/.test(modulePath) && Array.isArray(module.dependencies) && includedFileMap[modulePath]) {
        module.dependencies.forEach(importDependency => {
          if (importDependency.constructor.name === "HarmonyImportSpecifierDependency" && importDependency.id) {
            const dependencyPath = convertToUnixPath(importDependency.module.resource);
            if (includedFileMap[dependencyPath] && (!filterFunc || filterFunc(modulePath, dependencyPath))) {
              if (!projectGraph.has(dependencyPath)) {
                projectGraph.set(dependencyPath, new Map());
              }
              const moduleGraph = projectGraph.get(dependencyPath);
              if (!moduleGraph.has(importDependency.id)) {
                moduleGraph.set(importDependency.id, new Set());
              }
              moduleGraph.set(importDependency.id, moduleGraph.get(importDependency.id).add(modulePath));
            }
          }
        });
      }
    }
  });
  return projectGraph;
}

function convertFilesToDict(assets) {
  return assets
    .filter(file => file && file.indexOf("node_modules") === -1)
    .reduce((acc, file) => {
      const unixFile = convertToUnixPath(file);

      acc[unixFile] = true;
      return acc;
    }, {});
}

function convertToUnixPath(path) {
  return path.replace(/\\+/g, "/");
}

module.exports = WebpackExportStatsPlugin;
