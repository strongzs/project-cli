const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

const lintStyles = ['standard', 'airbnb']

/**
 * Sorts dependencies in package.json alphabetically.
 * They are unsorted because they were grouped for the handlebars helpers
 * @param {object} data Data from questionnaire
 */
exports.sortDependencies = function sortDependencies(data) {
    const packageJsonFile = path.join(
        data.inPlace ? '' : data.destDirName,
        'package.json'
    )
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile))
    packageJson.devDependencies = sortObject(packageJson.devDependencies)
    packageJson.dependencies = sortObject(packageJson.dependencies)
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n')
}

/**
 * Runs `npm install` in the project directory
 * @param {string} cwd Path of the created project directory
 * @param {object} data Data from questionnaire
 */
exports.installDependencies = function installDependencies(
    cwd,
    executable = 'npm',
    color
) {
    console.log(`\n\n# ${color('正在安装项目依赖，安装过程大概需要4~5分钟，请耐心等候...')}`)
    console.log('# ========================\n')
    return runCommand(executable, ['install'], {
        cwd,
    })
}

/**
 * Runs `npm run lint -- --fix` in the project directory
 * @param {string} cwd Path of the created project directory
 * @param {object} data Data from questionnaire
 */
exports.runLintFix = function runLintFix(cwd, data, color) {
    if (data.lint) {
        const args =
            data.autoInstall === 'npm' ? ['run', 'lint', '--', '--fix'] : ['run', 'lint', '--fix']
        return runCommand(data.autoInstall, args, {
            cwd,
        })
    }
    return Promise.resolve()
}

/**
 * Runs `npm run dev` in the project directory
 * @param {string} cwd Path of the created project directory
 * @param {object} data Data from questionnaire
 */
exports.runDev = function runLintFix(cwd, data, color) {
    const args = ['run', 'dev']
    return runCommand(data.autoInstall, args, {
        cwd,
    })
}

exports.buildDll = function runLintFix(cwd, data, color) {
    const args = ['run', 'build:dll']
    return runCommand(data.autoInstall, args, {
        cwd,
    })
}

/**
 * Prints the final message with instructions of necessary next steps.
 * @param {Object} data Data from questionnaire.
 */
exports.printMessage = function printMessage(data, { green, yellow }) {
    const message = `
# ${green(data.autoInstall?'项目依赖安装完成!':'')}
# ========================

常用命令:

  ${yellow(
    `${installMsg(data)}${lintMsg(data)}${lintFixMsg(data)}${buildMsg(data)}启动本地服务器：npm run dev`
  )}
  
`
    console.log(message)
}

/**
 * If the user will have to run `npm install` or `yarn` themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from the questionnaire
 */
function installMsg(data) {
    return !data.autoInstall ? '安装依赖：npm install \n  ':''
}

/**
 * If the user will have to run lint themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from questionnaire.
 */
function lintMsg(data) {
    return !data.autoInstall &&data.lint ?'代码规范检测：npm run lint \n  ':''
}

/**
 * If the user will have to run fix themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from questionnaire.
 */
function lintFixMsg(data) {
    return !data.autoInstall && data.lint ?'自动修复代码规范问题：npm run fix \n  ':''
}

/**
 * If the user will have to run fix themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from questionnaire.
 */
function buildMsg(data) {
    return '编译： npm run build \n  '
}

/**
 * Spawns a child process and runs the specified command
 * By default, runs in the CWD and inherits stdio
 * Options are the same as node's child_process.spawn
 * @param {string} cmd
 * @param {array<string>} args
 * @param {object} options
 */
function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const spwan = spawn(
            cmd,
            args,
            Object.assign({
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                },
                options
            )
        )

        spwan.on('exit', () => {
            resolve()
        })
    })
}

function sortObject(object) {
    // Based on https://github.com/yarnpkg/yarn/blob/v1.3.2/src/config.js#L79-L85
    const sortedObject = {}
    Object.keys(object)
        .sort()
        .forEach(item => {
            sortedObject[item] = object[item]
        })
    return sortedObject
}