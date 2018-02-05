const path = require('path')
const fs = require('fs')

const {
    sortDependencies,
    installDependencies,
    runLintFix,
    runDev,
    buildDll,
    printMessage,
} = require('./utils')
const pkg = require('./package.json')

const { template } = require('./utils/template')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
    metalsmith: {
        // When running tests for the template, this adds answers for the selected scenario
        before: addTestAnswers
    },
    helpers: {
        if_or(v1, v2, options) {
            if (v1 || v2) {
                return options.fn(this)
            }
            return options.inverse(this)
        },
        if_equal(v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this)
            }
            return options.inverse(this)
        },
        if_notequal(v1, v2, options) {
            if (v1 !== v2) {
                return options.fn(this)
            }
            return options.inverse(this)
        },
        template_version() {
            return templateVersion
        },
    },
    prompts: {
        cliType: {
            type: "list",
            message: "项目类型",
            default: 0,
            choices: [{
                name: "PC端项目（默认集成element-ui）",
                value: "PC",
                short: "PC端项目（默认集成element-ui）"
            }, {
                name: "移动端项目（默认集成vux）",
                value: "mobile",
                short: "移动端项目（默认集成vux）"
            }]
        },
        name: {
            when: 'isNotTest',
            type: 'string',
            required: true,
            message: '项目名称（合同号+项目名称，如综合信息平台：2017386-integrated-information-platform）',
        },
        description: {
            when: 'isNotTest',
            type: 'string',
            required: false,
            message: '项目简要概述',
            default: '一个Vue项目。'
        },
        author: {
            when: 'isNotTest',
            type: 'string',
            message: '作者',
        },
        lint: {
            when: 'isNotTest',
            type: 'confirm',
            message: '是否使用ESLint规范您的代码?'
        },
        unit: {
            when: 'isNotTest && !name',
            type: 'confirm',
            message: '是否需要安装单元测试？',
            default: false
        },
        runner: {
            when: 'isNotTest && !name && unit',
            type: 'list',
            message: '选择一个测试运行器',
            choices: [{
                    name: 'Jest',
                    value: 'jest',
                    short: 'jest',
                },
                {
                    name: 'Karma and Mocha',
                    value: 'karma',
                    short: 'karma',
                },
                {
                    name: 'none (自定义)',
                    value: 'noTest',
                    short: 'noTest',
                },
            ],
        },
        e2e: {
            when: 'isNotTest && !name',
            type: 'confirm',
            message: '是否使用Nightwatch来进行e2e（端对端）测试？',
            default: false
        },
        api: {
            when: 'isNotTest',
            type: 'string',
            message: 'API接口地址（如：http://47.95.14.230:9174，默认：localhost）',
            default: 'localhost'
        },
        autoInstall: {
            when: 'isNotTest',
            type: 'list',
            message: '在项目生成之后，是否需要自动安装依赖？',
            choices: [{
                    name: '是的',
                    value: 'npm',
                    short: 'Yes',
                },
                {
                    name: '不，我要自己安装',
                    value: false,
                    short: 'No',
                }
            ],
        }
    },
    filters: {
        'static/login_out.png': "cliType === 'PC'",
        'static/nav_arrow_b_s.png': "cliType === 'PC'",
        'static/nav_arrow_b_x.png': "cliType === 'PC'",
        'static/top_log_new.png': "cliType === 'PC'",
        'static/bj.png': "cliType === 'mobile'",
        'src/components/menu-grid.vue': "cliType === 'mobile'",
        'src/components/nav-menu.vue': "cliType === 'PC'",
        'src/components/navigation.vue': "cliType === 'PC'",
        '.eslintrc.js': 'lint',
        '.eslintignore': 'lint',
        'config/test.env.js': '0&&unit || 0&&e2e',
        'build/webpack.test.conf.js': "0&&unit && runner === 'karma'",
        'test/unit/**/*': '0&&unit',
        'test/unit/index.js': "0&&unit && runner === 'karma'",
        'test/unit/jest.conf.js': "0&&unit && runner === 'jest'",
        'test/unit/karma.conf.js': "0&&unit && runner === 'karma'",
        'test/unit/specs/index.js': "0&&unit && runner === 'karma'",
        'test/unit/setup.js': "0&&unit && runner === 'jest'",
        'test/e2e/**/*': '0&&e2e'
    },
    complete: function(data, { chalk }) {
        const green = chalk.green

        sortDependencies(data, green)

        const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

        if (data.cliType === 'PC') {
            const login = path.join(
                data.inPlace ? '' : data.destDirName,
                'src', 'components', 'login.vue'
            )

            fs.writeFile(login, template.PCLogin, err => {
                if (err) throw err
            })

            const navMenu = path.join(
                data.inPlace ? '' : data.destDirName,
                'src', 'components', 'nav-menu.vue'
            )

            fs.writeFile(navMenu, template.navMenu, err => {
                if (err) throw err
            })

            const navigation = path.join(
                data.inPlace ? '' : data.destDirName,
                'src', 'components', 'navigation.vue'
            )

            fs.writeFile(navigation, template.navigation, err => {
                if (err) throw err
            })
        }

        if (data.cliType === 'mobile') {
            const login = path.join(
                data.inPlace ? '' : data.destDirName,
                'src', 'components', 'login.vue'
            )

            fs.writeFile(login, template.MobileLogin, err => {
                if (err) throw err
            })

            const menuGrid = path.join(
                data.inPlace ? '' : data.destDirName,
                'src', 'components', 'menu-grid.vue'
            )

            fs.writeFile(menuGrid, template.menuGrid, err => {
                if (err) throw err
            })
        }

        if (data.autoInstall) {

            console.log(chalk.yellow('Message:'), '安装过程大概需要4~5分钟，请耐心等候...')

            installDependencies(cwd, data.autoInstall, green)
                .then(()=>{
                    return buildDll(cwd, data, green)
                })
                .then(() => {
                    return runDev(cwd, data, green)
                })
                .then(() => {
                    printMessage(data, green)
                })
                .catch(e => {
                    console.log(chalk.red('Error:'), e)
                })
        } else {
            printMessage(data, chalk)
        }
    }
}