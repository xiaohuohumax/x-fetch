import type { InputOption, Plugin, RollupOptions } from "rollup"
import type { Options as DtsOptions } from "rollup-plugin-dts"
import fs from "node:fs"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import { defineConfig } from "rollup"
import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

interface PackageJson {
  version: string
  devDependencies?: Record<string, string>
  dependencies?: Record<string, string>
  author: {
    name: string
  }
  [key: string]: any
}

function loadPackageJson(pkg: string): PackageJson {
  return JSON.parse(fs.readFileSync(pkg, "utf-8"))
}

interface CreateOptions {
  input?: InputOption
  dependenciesPrefix?: string
  external?: string[]
  outputDir?: string
  plugins?: Plugin[]
  packageJsonPath?: string
}

const DEFAULT_CREATE_OPTIONS: Required<CreateOptions> = {
  input: "./src/index.ts",
  dependenciesPrefix: "@xiaohuohumax/",
  external: [],
  outputDir: "./dist",
  plugins: [],
  packageJsonPath: "./package.json",
}

interface CreateBuildOptions extends CreateOptions { }

function getExternalByDependencies(packageJson: PackageJson, prefix: string): string[] {
  return Object.keys(Object.assign({}, packageJson.dependencies, packageJson.devDependencies))
    .filter(dep => dep.startsWith(prefix))
}

function createBanner(pkg: PackageJson): string {
  const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * Copyright (c) 2024 ${pkg.author.name}
 * ${pkg.license} License.
 */`
  return banner
}

export function createBuildConfig(options?: CreateBuildOptions): RollupOptions {
  const config: Required<CreateBuildOptions> = Object.assign({
    ...DEFAULT_CREATE_OPTIONS,
  }, options)

  const pkg = loadPackageJson(config.packageJsonPath)
  const external = getExternalByDependencies(pkg, config.dependenciesPrefix)

  return defineConfig({
    input: config.input,
    external: external.concat(config.external),
    output: [
      {
        format: "cjs",
        dir: config.outputDir,
        entryFileNames: "[name].cjs",
        banner: createBanner(pkg),
      },
      {
        format: "esm",
        dir: config.outputDir,
        entryFileNames: "[name].mjs",
        banner: createBanner(pkg),
      },
    ],
    plugins: [
      commonjs(),
      resolve(),
      esbuild(),
      json(),
      esbuild(),
    ].concat(config.plugins),
  })
}

interface CreateTypesConfigOptions extends CreateOptions {
  dtsOptions?: DtsOptions
}

export function createTypesConfig(options?: CreateTypesConfigOptions): RollupOptions {
  const config: Required<CreateTypesConfigOptions> = Object.assign({
    ...DEFAULT_CREATE_OPTIONS,
    dtsOptions: {},
  }, options)

  const pkg = loadPackageJson(config.packageJsonPath)
  const external = getExternalByDependencies(pkg, config.dependenciesPrefix)

  return defineConfig({
    input: config.input,
    external: external.concat(config.external),
    output: [
      {
        format: "esm",
        dir: config.outputDir,
        banner: createBanner(pkg),
      },
    ],
    plugins: [json(), dts()].concat(config.plugins),
  })
}
