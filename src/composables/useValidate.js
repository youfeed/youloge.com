/**
 * 验证和处理表单数据（JS 版，修复正则错误）
 * 其他代码不变，仅修改 presets 中的 xss 规则
 */
export default function useValidate(params = {}, rules = {}, intersect = true) {
    // 工具函数：模拟 PHP mb_strlen（按字符数计算，支持中文）
    const mbStrlen = (str) => {
        if (typeof str !== 'string') return 0;
        // 匹配中文字符，每个中文字符算1个，其他字符也算1个
        return str.replace(/[^\x00-\xff]/g, 'xx').length / 2;
    };

    // 工具函数：模拟 PHP filter_var
    const filterVar = (value, filter, options = {}) => {
        switch (filter) {
            case 'EMAIL':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'URL':
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(value);
            case 'IP':
                return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
            case 'REGEXP':
                const regex = new RegExp(options.regexp);
                return regex.test(value);
            default:
                return true;
        }
    };

    // 预设验证/处理规则（对齐 PHP presets）
    const presets = {
        // 基础处理
        required: (field, param, args, msg = '%s 字段不能为空') => {
            if (param === undefined || param === null) {
                throw new Error(sprintf(msg, field));
            }
            if (typeof param === 'string' && param.trim() === '') {
                throw new Error(sprintf(msg, field));
            }
            return param;
        },
        require: (field, param, args, msg = '%s 字段不能为空') => {
            return presets.required(field, param, args, msg);
        },
        number: (field, param, args) => {
            return param === undefined || param === null ? (args || 0) : parseInt(param, 10);
        },
        boolean: (field, param, args) => {
            return param === undefined || param === null ? (args || false) : Boolean(param);
        },
        decimal: (field, param, args) => {
            return param === undefined || param === null ? (args || 0) : parseFloat(param);
        },
        text: (field, param, args) => {
            return param === undefined || param === null ? (args || '') : String(param);
        },
        list: (field, param, args) => {
            if (param === undefined || param === null) return args || [];
            return Array.isArray(param) ? param : [param];
        },
        map: (field, param, args) => {
            if (param === undefined || param === null) return args || {};
            return typeof param === 'object' && !Array.isArray(param) ? param : { value: param };
        },
        sprintf: (field, param, args = '') => {
            return sprintf(args, param);
        },
        format: (field, param, args = '') => {
            return presets.sprintf(field, param, args);
        },
        // 常用处理 —— XSS 过滤器
        xss: (field, param, args) => {
            if (typeof param !== 'string') return param;
            // 移除危险字符：连字符、引号、百分号、下划线、括号
            const replace = param.replace(/[-'";%_()]/g, '');
            // 移除HTML标签
            return replace.replace(/<[^>]*>/g, '');
        },
        html: (field, param, args) => {
            if (typeof param !== 'string') return param;
            const flags = args || (ENT_COMPAT | ENT_HTML401);
            return htmlspecialchars(param, flags);
        },
        join: (field, param, args) => {
            if (!Array.isArray(param)) return param;
            return param.join(args || ',');
        },
        trim: (field, param, args) => {
            return typeof param === 'string' ? param.trim() : (args || '');
        },
        upper: (field, param, args) => {
            return typeof param === 'string' ? param.toUpperCase() : (args || param);
        },
        lower: (field, param, args) => {
            return typeof param === 'string' ? param.toLowerCase() : (args || param);
        },
        // 常用验证
        email: (field, param, args, msg = '%s 字段值必须是邮箱') => {
            if (filterVar(param, 'EMAIL')) return param;
            throw new Error(sprintf(msg, field));
        },
        mobile: (field, param, args, msg = '%s 字段值必须是手机号') => {
            if (filterVar(param, 'REGEXP', { regexp: /^1[3456789]\d{9}$/ })) return param;
            throw new Error(sprintf(msg, field));
        },
        url: (field, param, args, msg = '%s 字段值必须是网址') => {
            if (filterVar(param, 'URL')) return param;
            throw new Error(sprintf(msg, field));
        },
        ip: (field, param, args, msg = '%s 字段值必须是IP地址') => {
            if (filterVar(param, 'IP')) return param;
            throw new Error(sprintf(msg, field));
        },
        date: (field, param, args, msg = '%s 字段值必须是%s日期格式') => {
            const format = args || 'YYYY-MM-DD HH:mm:ss';
            // 简化版日期格式验证（可扩展更精准的解析）
            let regex;
            switch (format) {
                case 'YYYY-MM-DD HH:mm:ss':
                    regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
                    break;
                case 'YYYY-MM-DD':
                    regex = /^\d{4}-\d{2}-\d{2}$/;
                    break;
                default:
                    regex = new RegExp(format.replace(/YYYY/g, '\\d{4}').replace(/MM/g, '\\d{2}').replace(/DD/g, '\\d{2}').replace(/HH/g, '\\d{2}').replace(/mm/g, '\\d{2}').replace(/ss/g, '\\d{2}'));
            }
            if (regex.test(param)) return param;
            throw new Error(sprintf(msg, field, format));
        },
        time: (field, param, args, msg = '%s 字段值必须是时间戳') => {
            if (isNaN(param) || parseInt(param, 10) != param) {
                throw new Error(sprintf(msg, field));
            }
            const minTimestamp = new Date('1970-01-01').getTime() / 1000;
            const maxTimestamp = new Date('2099-01-01').getTime() / 1000;
            if (param <= minTimestamp || param >= maxTimestamp) {
                throw new Error(sprintf(msg, field));
            }
            return param;
        },
        idcard: (field, param, args, msg = '%s 字段值必须是身份证号 %s') => {
            if (param.length !== 18) {
                throw new Error(sprintf(msg, field, '长度不足'));
            }
            if (!/^\d{17}[\dXx]$/.test(param)) {
                throw new Error(sprintf(msg, field, '格式错误'));
            }
            // 加权因子
            const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            // 校验码映射
            const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
            // 计算校验码
            let sum = 0;
            for (let i = 0; i < 17; i++) {
                sum += parseInt(param[i], 10) * weightFactors[i];
            }
            const mod = sum % 11;
            const checkCode = checkCodes[mod];
            if (param[17].toUpperCase() !== checkCode) {
                throw new Error(sprintf(msg, field, '校验错误'));
            }
            return param;
        },
        regex: (field, param, args, msg = '%s 字段值格式错误') => {
            const regex = new RegExp(args);
            if (regex.test(param)) return param;
            throw new Error(sprintf(msg, field));
        },
        test: (field, param, args, msg = '%s 字段值格式错误') => {
            return presets.regex(field, param, args, msg);
        },
        // 数字相关
        min: (field, param, args, msg = '%s 字段数字不能小于%s') => {
            const min = Math.min(...args.split(',').map(Number));
            if (!isNaN(param) && Number(param) >= min) return param;
            throw new Error(sprintf(msg, field, min));
        },
        max: (field, param, args, msg = '%s 字段数字不能大于%s') => {
            const max = Math.max(...args.split(',').map(Number));
            if (!isNaN(param) && Number(param) <= max) return param;
            throw new Error(sprintf(msg, field, max));
        },
        between: (field, param, args, msg = '%s 字段数字必须在%s和%s之间') => {
            const [min, max] = args.split(',').map(Number).sort((a, b) => a - b);
            if (!isNaN(param) && Number(param) >= min && Number(param) <= max) return param;
            throw new Error(sprintf(msg, field, min, max));
        },
        // 字符串相关
        start: (field, param, args, msg = '%s 字段值必须以%s开头') => {
            if (typeof param === 'string' && param.startsWith(args)) return param;
            throw new Error(sprintf(msg, field, args));
        },
        end: (field, param, args, msg = '%s 字段值必须以%s结尾') => {
            if (typeof param === 'string' && param.endsWith(args)) return param;
            throw new Error(sprintf(msg, field, args));
        },
        digit: (field, param, args, msg = '%s 字段值必须是数字') => {
            if (/^\d+$/.test(param)) return param;
            throw new Error(sprintf(msg, field));
        },
        alpha: (field, param, args, msg = '%s 字段值必须是字母') => {
            if (/^[a-zA-Z]+$/.test(param)) return param;
            throw new Error(sprintf(msg, field));
        },
        alphanum: (field, param, args, msg = '%s 字段值必须是字母和数字') => {
            if (/^[a-zA-Z0-9]+$/.test(param)) return param;
            throw new Error(sprintf(msg, field));
        },
        length: (field, param, args, msg = '%s 字段长度必须%s~%s个字符') => {
            const [min, max] = args.split(',').map(Number).sort((a, b) => a - b);
            const len = mbStrlen(param);
            if (len >= min && len <= max) return param;
            throw new Error(sprintf(msg, field, min, max));
        },
        len: (field, param, args, msg = '%s 字段长度必须%s~%s个字符') => {
            return presets.length(field, param, args, msg);
        },
        in: (field, param, args, msg = '%s 字段值必须在%s范围中') => {
            const list = args.split(',');
            if (list.includes(param)) return param;
            throw new Error(sprintf(msg, field, args));
        },
        not: (field, param, args, msg = '%s 字段值不能在%s范围中') => {
            const list = args.split(',');
            if (!list.includes(param)) return param;
            throw new Error(sprintf(msg, field, args));
        },
        // 数组数量
        count: (field, param, args, msg = '%s 字段值数量必须%s~%s个') => {
            const [min, max] = args.split(',').map(Number).sort((a, b) => a - b);
            if (Array.isArray(param) && param.length >= min && param.length <= max) return param;
            throw new Error(sprintf(msg, field, min, max));
        }
    };

    // 工具函数：模拟 PHP sprintf
    function sprintf(template, ...args) {
        let index = 0;
        return template.replace(/%s/g, () => args[index++] || '');
    }

    // 工具函数：模拟 PHP htmlspecialchars
    function htmlspecialchars(str, flags = ENT_COMPAT | ENT_HTML401) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        // 根据 flags 决定是否转义单引号
        if (flags & ENT_COMPAT) {
            delete map["'"];
        }
        return str.replace(/[&<>"']/g, (char) => map[char] || char);
    }

    // 常量：模拟 PHP ENT 常量
    const ENT_COMPAT = 2;
    const ENT_HTML401 = 0;

    // 工具函数：判断是否为数组（对齐 PHP array_is_list）
    function isArrayList(arr) {
        return Array.isArray(arr) && arr.every((_, idx) => idx === arr.indexOf(_));
    }

    try {
        // 深拷贝参数，避免修改原对象
        const processedParams = JSON.parse(JSON.stringify(params));

        // 遍历验证规则
        for (const [field, expression] of Object.entries(rules)) {
            let param = processedParams[field];

            // 处理数组类型的规则（递归验证数组元素）
            if (typeof expression === 'object' && expression !== null) {
                // 数组规则（如字段值是数组，逐个验证）
                if (Array.isArray(expression)) {
                    const [firstRule] = expression;
                    if (Array.isArray(param)) {
                        for (let i = 0; i < param.length; i++) {
                            const itemResult = useValidate(
                                { [field]: param[i] },
                                { [field]: typeof firstRule === 'string' ? expression : firstRule },
                                intersect
                            );
                            if (itemResult.err === 400) {
                                throw new Error(`${field}.${i}.${itemResult.msg}`);
                            }
                            param[i] = itemResult[field];
                        }
                    }
                } else {
                    // 对象规则（链式递归）
                    for (const subExpr of Object.values(expression)) {
                        const subResult = useValidate({ [field]: param }, { [field]: subExpr }, intersect);
                        if (subResult.err === 400) {
                            throw new Error(`${field}.${subResult.msg}`);
                        }
                        param = subResult[field];
                    }
                }
                processedParams[field] = param;
                continue;
            }

            // 处理字符串规则（分割 自定义提示# 和 链式规则|）
            const [ruleStr, customMsg] = expression.split('#');
            const ruleList = ruleStr.split('|');

            // 检查是否包含 required 规则
            const isRequired = ruleList.some(rule => rule.startsWith('require') || rule.startsWith('required'));

            // 遍历单个规则（如 required|email|length:3,10）
            for (const singleRule of ruleList) {
                const [ruleName, ruleParam] = singleRule.split(':', 2);
                const ruleHandler = presets[ruleName];

                // 非必填且参数为空，跳过；无规则处理器，跳过
                if ((param === undefined || param === null) && !isRequired || !ruleHandler) {
                    // 类型转换规则且有默认值，设置默认值
                    if (['number', 'boolean', 'decimal', 'text', 'list', 'map'].includes(ruleName) && ruleParam !== undefined) {
                        processedParams[field] = ruleParam;
                    }
                    continue;
                }

                // 执行规则处理器
                const args = [field, param, ruleParam];
                if (customMsg) args.push(customMsg);
                param = ruleHandler(...args);
            }

            // 更新处理后的参数
            processedParams[field] = param;
        }

        // 只返回验证过的字段（交集）
        if (intersect) {
            const result = {};
            for (const field of Object.keys(rules)) {
                if (processedParams.hasOwnProperty(field)) {
                    result[field] = processedParams[field];
                }
            }
            return result;
        }

        return processedParams;
    } catch (error) {
        return { err: 400, msg: error.message };
    }
}