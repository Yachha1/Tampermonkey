function 发起HTTP请求函数(响应函数, 报错函数, 结束函数) {
    let 进度索引 = 0;
    let 完成数量 = 0;
    let 可用线程 = 总线程数;

    发起单个HTTP请求函数();

    function 发起单个HTTP请求函数() {
        while (可用线程 > 0) {
            if (进度索引 >= 网站地址数组.length) {
                break;
            }
            可用线程--;
            let 当前索引 = 进度索引;
            进度索引++;
            GM_xmlhttpRequest({
                method: `GET`,
                url: 网站地址数组[当前索引],
                onload: function (响应信息) {
                    响应函数(响应信息, 当前索引);

                    可用线程++;
                    if (请求情况数组[当前索引] == `请求成功`) {
                        完成数量++;
                        记录日志函数(`✅ 进度：${完成数量}/${网站地址数组.length}`, `日志`);
                        if (完成数量 < 网站地址数组.length) {
                            发起单个HTTP请求函数();
                        }
                        else {
                            结束函数();
                            return;
                        }
                    }
                    else if (请求情况数组[当前索引] == `重新请求`) {
                        发起指定HTTP请求函数(当前索引);
                    }
                    else {
                        记录日志函数(`❌ 未知请求情况：\n${网站地址数组[当前索引]}\n当前索引：${当前索引}`, `报错`);
                        return;
                    }
                },
                onerror: function (报错信息) {
                    报错函数(报错信息, 当前索引);

                    记录日志函数(`❌ 访问网址失败：\n${网站地址数组[当前索引]}\nerror：${报错信息.error}\nstatus: ${报错信息.status}\nstatusText: ${报错信息.statusText}`, `报错`);

                    可用线程++;
                    if (请求情况数组[当前索引] == `请求成功`) {
                        完成数量++;
                        记录日志函数(`✅ 进度：${完成数量}/${网站地址数组.length}`, `日志`);
                        if (完成数量 < 网站地址数组.length) {
                            发起单个HTTP请求函数();
                        }
                        else {
                            结束函数();
                            return;
                        }
                    }
                    else if (请求情况数组[当前索引] == `重新请求`) {
                        发起指定HTTP请求函数(当前索引);
                    }
                    else {
                        记录日志函数(`❌ 未知请求情况：\n${网站地址数组[当前索引]}\n当前索引：${当前索引}`, `报错`);
                        return;
                    }
                }
            });
        }
    }

    function 发起指定HTTP请求函数(当前索引) {
        if (当前索引 >= 网站地址数组.length) {
            return;
        }
        可用线程--;
        GM_xmlhttpRequest({
            method: `GET`,
            url: 网站地址数组[当前索引],
            onload: function (响应信息) {
                响应函数(响应信息, 当前索引);

                可用线程++;
                if (请求情况数组[当前索引] == `请求成功`) {
                    完成数量++;
                    记录日志函数(`✅ 进度：${完成数量}/${网站地址数组.length}`, `日志`);
                    if (完成数量 < 网站地址数组.length) {
                        发起单个HTTP请求函数();
                    }
                    else {
                        结束函数();
                        return;
                    }
                }
                else if (请求情况数组[当前索引] == `重新请求`) {
                    发起指定HTTP请求函数(当前索引);
                }
                else {
                    记录日志函数(`❌ 未知请求情况：\n${网站地址数组[当前索引]}\n当前索引：${当前索引}`, `报错`);
                    return;
                }
            },
            onerror: function (报错信息) {
                报错函数(报错信息, 当前索引);

                记录日志函数(`❌ 访问网址失败：\n${网站地址数组[当前索引]}\nerror：${报错信息.error}\nstatus: ${报错信息.status}\nstatusText: ${报错信息.statusText}`, `报错`);

                可用线程++;
                if (请求情况数组[当前索引] == `请求成功`) {
                    完成数量++;
                    记录日志函数(`✅ 进度：${完成数量}/${网站地址数组.length}`, `日志`);
                    if (完成数量 < 网站地址数组.length) {
                        发起单个HTTP请求函数();
                    }
                    else {
                        结束函数();
                        return;
                    }
                }
                else if (请求情况数组[当前索引] == `重新请求`) {
                    发起指定HTTP请求函数(当前索引);
                }
                else {
                    记录日志函数(`❌ 未知请求情况：\n${网站地址数组[当前索引]}\n当前索引：${当前索引}`, `报错`);
                    return;
                }
            }
        });
    }
}

function 查找网页元素函数(目标文档, 步骤) {
    let iframe元素 = 递归搜索Iframe函数(目标文档, 步骤);
    // 切换到iframe文档
    if (iframe元素) {
        try {
            目标文档 = iframe元素.contentDocument || iframe元素.contentWindow.document;
        }
        catch (e) {
            记录日志函数(`❌ iframe访问被阻止：${e.message}`, `报错`);
            return null;
        }
    }

    if (步骤.选择器) {
        return 目标文档.querySelector(步骤.选择器);
        //return 目标文档.querySelectorAll(步骤.选择器)[0];
    }
    else if (步骤.类名称) {
        return 目标文档.getElementsByClassName(步骤.类名称)[0];
    }
    else if (步骤.元素名称) {
        return 目标文档.getElementsByName(步骤.元素名称)[0];
    }
    else if (步骤.元素ID) {
        return 目标文档.getElementById(步骤.元素ID);
    }
    else if (步骤.标签名称) {
        return 目标文档.getElementsByTagName(步骤.标签名称)[0];
    }
    else if (步骤.XPath) {
        return 目标文档.evaluate(
            步骤.XPath,
            目标文档,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }
}

function 递归搜索Iframe函数(文档, 元素配置) {
    let Iframe数组 = 文档.querySelectorAll(`iframe`);

    if (元素配置.IframeID) {
        for (let iframe of Iframe数组) {
            if (元素配置?.是否模糊查询Iframe) {
                if (iframe.id.includes(元素配置.IframeID)) return iframe;
            }
            else {
                if (iframe.id == 元素配置.IframeID) return iframe;
            }
        }
        for (let iframe of Iframe数组) {
            try {
                let 目标文档 = iframe.contentDocument || iframe.contentWindow.document;
                let 目标Iframe = 递归搜索Iframe函数(目标文档, 元素配置);
                if (目标Iframe) return 目标Iframe;
            }
            catch (e) {
                记录日志函数(`❌ iframe访问被阻止：${e.message}`, `报错`);
            }
        }
    }
    else if (元素配置.IframeSRC) {
        for (let iframe of Iframe数组) {
            if (iframe.src.includes(元素配置.IframeSRC)) return iframe;
        }
        for (let iframe of Iframe数组) {
            try {
                let 目标文档 = iframe.contentDocument || iframe.contentWindow.document;
                let 目标Iframe = 递归搜索Iframe函数(目标文档, 元素配置);
                if (目标Iframe) return 目标Iframe;
            }
            catch (e) {
                记录日志函数(`❌ iframe访问被阻止：${e.message}`, `报错`);
            }
        }
    }

    return null;
}

function 操作网页元素函数(目标元素, 元素配置) {
    switch (元素配置?.类型) {
        case `按钮`:
            {
                目标元素.click();
                if (元素配置.选择器 != null) {
                    记录日志函数(`🖱️ 点击，元素选择器：${元素配置.选择器}`, `日志`);
                }
                else if (元素配置.类名称 != null) {
                    记录日志函数(`🖱️ 点击，元素类名称：${元素配置.类名称}`, `日志`);
                }
                else if (元素配置.元素名称 != null) {
                    记录日志函数(`🖱️ 点击，元素名称：${元素配置.元素名称}`, `日志`);
                }
                else if (元素配置.元素ID != null) {
                    记录日志函数(`🖱️ 点击，元素ID：${元素配置.元素ID}`, `日志`);
                }
                else if (元素配置.标签名称 != null) {
                    记录日志函数(`🖱️ 点击，元素标签名称：${元素配置.标签名称}`, `日志`);
                }
                else if (元素配置.XPath != null) {
                    记录日志函数(`🖱️ 点击，元素XPath：${元素配置.XPath}`, `日志`);
                }
                break;
            }

        case `树状图`:
            {
                let 树节点元素 = 目标元素.closest(`li.treeview`);
                if (树节点元素) {
                    let 当前节点状态 = 树节点元素.classList.contains(`menu-open`);
                    let 目标节点状态 = 元素配置.值 === `true`;
                    if (当前节点状态 !== 目标节点状态) {
                        目标元素.click();
                        if (元素配置.选择器 != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素选择器：${元素配置.选择器}`, `日志`);
                        }
                        else if (元素配置.类名称 != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素类名称：${元素配置.类名称}`, `日志`);
                        }
                        else if (元素配置.元素名称 != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素名称：${元素配置.元素名称}`, `日志`);
                        }
                        else if (元素配置.元素ID != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素ID：${元素配置.元素ID}`, `日志`);
                        }
                        else if (元素配置.标签名称 != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素标签名称：${元素配置.标签名称}`, `日志`);
                        }
                        else if (元素配置.XPath != null) {
                            记录日志函数(`🖱️ ${目标节点状态 ? `展开` : `折叠`}树节点，元素XPath：${元素配置.XPath}`, `日志`);
                        }
                    }
                }
                else {
                    if (元素配置.选择器 != null) {
                        记录日志函数(`❌ 树节点未找到，元素选择器：${元素配置.选择器}`, `报错`);
                    }
                    else if (元素配置.类名称 != null) {
                        记录日志函数(`❌ 树节点未找到，元素类名称：${元素配置.类名称}`, `报错`);
                    }
                    else if (元素配置.元素名称 != null) {
                        记录日志函数(`❌ 树节点未找到，元素名称：${元素配置.元素名称}`, `报错`);
                    }
                    else if (元素配置.元素ID != null) {
                        记录日志函数(`❌ 树节点未找到，元素ID：${元素配置.元素ID}`, `报错`);
                    }
                    else if (元素配置.标签名称 != null) {
                        记录日志函数(`❌ 树节点未找到，元素标签名称：${元素配置.标签名称}`, `报错`);
                    }
                    else if (元素配置.XPath != null) {
                        记录日志函数(`❌ 树节点未找到，元素XPath：${元素配置.XPath}`, `报错`);
                    }
                }
                break;
            }

        case `文本框`:
            {
                目标元素.focus();
                if (元素配置?.是否粘贴) {
                    目标元素.select();
                    let 插入事件 = document.execCommand(`insertText`, false, 元素配置.值);
                    if (!插入事件) {
                        throw new Error(`粘贴失败`);
                    }
                }
                else {
                    目标元素.value = 元素配置.值;
                }
                let 输入事件 = new Event(`input`, { bubbles: true });
                目标元素.dispatchEvent(输入事件);
                let 改变事件 = new Event(`change`, { bubbles: true });
                目标元素.dispatchEvent(改变事件);
                if (元素配置?.是否回车) {
                    let 回车事件 = new KeyboardEvent(`keydown`, {
                        key: `Enter`,
                        code: `Enter`,
                        keyCode: 13,
                        bubbles: true,
                        cancelable: true,
                    });
                    setTimeout(() => { 目标元素.dispatchEvent(回车事件); }, 50);
                }
                if (元素配置.选择器 != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素选择器：${元素配置.选择器}`, `日志`);
                }
                else if (元素配置.类名称 != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素类名称：${元素配置.类名称}`, `日志`);
                }
                else if (元素配置.元素名称 != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素名称：${元素配置.元素名称}`, `日志`);
                }
                else if (元素配置.元素ID != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素ID：${元素配置.元素ID}`, `日志`);
                }
                else if (元素配置.标签名称 != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素标签名称：${元素配置.标签名称}`, `日志`);
                }
                else if (元素配置.XPath != null) {
                    记录日志函数(`🖱️ 设置文本框值 = ${元素配置.值}，元素XPath：${元素配置.XPath}`, `日志`);
                }
                break;
            }

        case `下拉框`:
            {
                // 分割多选值（支持逗号分隔）
                let 值列表 = [];
                if (元素配置?.分割符) {
                    值列表 = 元素配置.值.split(元素配置.分割符).map(v => v.trim());
                }
                else {
                    值列表 = 元素配置.值.split(`,`).map(v => v.trim());
                }
                //标准下拉框
                if (目标元素.tagName === `SELECT`) {
                    //多选
                    if (目标元素.multiple) {
                        // 多选脚本：清除所有选项后按值列表选中
                        Array.from(目标元素.options).forEach(option => { option.selected = 值列表.includes(option.value) || 值列表.includes(option.textContent.trim()); });
                    }
                    //单选
                    else {
                        // 单选脚本：取第一个有效值
                        let 有效值 = 值列表.find(v => Array.from(目标元素.options).some(opt => opt.value === v || opt.textContent.trim() === v));
                        if (有效值) 目标元素.value = 有效值;
                    }
                    let 改变事件 = new Event(`change`, { bubbles: true });
                    目标元素.dispatchEvent(改变事件);
                }
                // 非标准下拉框
                else {
                    目标元素.click();
                    setTimeout(() => {
                        值列表.forEach(值 => {
                            if (元素配置?.是否选择器赋值) {
                                if (元素配置.IframeID) {
                                    let 选项元素 = 查找网页元素函数(目标元素, {
                                        IframeID: 元素配置.IframeID,
                                        是否模糊查询Iframe: 元素配置?.是否模糊查询Iframe,
                                        选择器: 值,
                                    });
                                    if (选项元素) {
                                        setTimeout(() => { 选项元素.click(); }, 0);
                                    }
                                }
                                else if (元素配置.IframeSRC) {
                                    let 选项元素 = 查找网页元素函数(目标元素, {
                                        IframeSRC: 元素配置.IframeSRC,
                                        选择器: 值,
                                    });
                                    if (选项元素) {
                                        setTimeout(() => { 选项元素.click(); }, 0);
                                    }
                                }
                                else {
                                    let 选项元素 = 查找网页元素函数(目标元素, {
                                        选择器: 值,
                                    });
                                    if (选项元素) {
                                        setTimeout(() => { 选项元素.click(); }, 0);
                                    }
                                }
                            }
                            else {
                                let 选择器列表 = [
                                    `[lay-value="${值}"]`,
                                    `[data-value="${值}"]`,
                                    `[svalue="${值}"]`,
                                    `[value="${值}"]`,
                                    `:contains("${值}")`
                                ];
                                for (let 选择器 of 选择器列表) {
                                    if (元素配置.IframeID) {
                                        let 选项元素 = 查找网页元素函数(目标元素, {
                                            IframeID: 元素配置.IframeID,
                                            是否模糊查询Iframe: 元素配置?.是否模糊查询Iframe,
                                            选择器: 选择器,
                                        });
                                        if (选项元素) {
                                            setTimeout(() => { 选项元素.click(); }, 0);
                                            break;
                                        }
                                    }
                                    else if (元素配置.IframeSRC) {
                                        let 选项元素 = 查找网页元素函数(目标元素, {
                                            IframeSRC: 元素配置.IframeSRC,
                                            选择器: 选择器,
                                        });
                                        if (选项元素) {
                                            setTimeout(() => { 选项元素.click(); }, 0);
                                            break;
                                        }
                                    }
                                    else {
                                        let 选项元素 = 查找网页元素函数(目标元素, {
                                            选择器: 选择器,
                                        });
                                        if (选项元素) {
                                            setTimeout(() => { 选项元素.click(); }, 0);
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                        if (元素配置?.是否关闭下拉框) {
                            setTimeout(() => { 目标元素.click(); }, 0);
                        }
                    }, 100);
                }
                if (元素配置.选择器 != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素选择器：${元素配置.选择器}`, `日志`);
                }
                else if (元素配置.类名称 != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素类名称：${元素配置.类名称}`, `日志`);
                }
                else if (元素配置.元素名称 != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素名称：${元素配置.元素名称}`, `日志`);
                }
                else if (元素配置.元素ID != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素ID：${元素配置.元素ID}`, `日志`);
                }
                else if (元素配置.标签名称 != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素标签名称：${元素配置.标签名称}`, `日志`);
                }
                else if (元素配置.XPath != null) {
                    记录日志函数(`🖱️ 设置下拉框 = ${元素配置.值}，元素XPath：${元素配置.XPath}`, `日志`);
                }
                break;
            }

        case `下拉选项`:
            {
                目标元素.selected = true;
                let 改变事件 = new Event(`change`, { bubbles: true });
                目标元素.dispatchEvent(改变事件);
                if (元素配置.选择器 != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素选择器：${元素配置.选择器}`, `日志`);
                }
                else if (元素配置.类名称 != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素类名称：${元素配置.类名称}`, `日志`);
                }
                else if (元素配置.元素名称 != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素名称：${元素配置.元素名称}`, `日志`);
                }
                else if (元素配置.元素ID != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素ID：${元素配置.元素ID}`, `日志`);
                }
                else if (元素配置.标签名称 != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素标签名称：${元素配置.标签名称}`, `日志`);
                }
                else if (元素配置.XPath != null) {
                    记录日志函数(`🖱️ 选择下拉选项，元素XPath：${元素配置.XPath}`, `日志`);
                }
                break;
            }

        case `勾选框`:
            {
                if ((目标元素.checked && 元素配置.值 != `true`) || (!目标元素.checked && 元素配置.值 == `true`)) {
                    目标元素.click();
                }
                if (元素配置.选择器 != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素选择器：${元素配置.选择器}`, `日志`);
                }
                else if (元素配置.类名称 != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素类名称：${元素配置.类名称}`, `日志`);
                }
                else if (元素配置.元素名称 != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素名称：${元素配置.元素名称}`, `日志`);
                }
                else if (元素配置.元素ID != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素ID：${元素配置.元素ID}`, `日志`);
                }
                else if (元素配置.标签名称 != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素标签名称：${元素配置.标签名称}`, `日志`);
                }
                else if (元素配置.XPath != null) {
                    记录日志函数(`🖱️ 设置勾选框 = ${元素配置.值 === `true`}，元素XPath：${元素配置.XPath}`, `日志`);
                }
                break;
            }
    }
}

function 执行操作函数() {
    if (!是否正在运行) return;

    // 等待执行
    if ((配置对象[当前脚本名称]?.步骤[当前步骤ID]?.是否等待稳定 || 配置对象[当前脚本名称]?.步骤[当前步骤ID]?.是否等待条件) && !配置对象[当前脚本名称]?.步骤[当前步骤ID]?.是否跳过 && !是否结束等待) {
        等待执行函数(() => {
            记录日志函数(`⏳ 已结束等待`, `日志`);
            是否结束等待 = true;
            GM_setValue(`是否结束等待`, 是否结束等待);
            尝试执行操作函数();
        });
    }
    // 直接执行
    else {
        尝试执行操作函数();
    }

    function 尝试执行操作函数() {
        if (当前步骤ID >= 配置对象[当前脚本名称].步骤.length) {
            if (配置对象[当前脚本名称]?.是否循环执行) {
                当前步骤ID = 0;
                GM_setValue(`当前步骤ID`, 当前步骤ID);
                当前循环次数++;
                GM_setValue(`当前循环次数`, 当前循环次数);
                记录日志函数(`✅ 完成${当前循环次数}/${脚本循环次数}次循环`, `日志`);
                if (当前循环次数 >= 脚本循环次数) {
                    停止流程函数();
                    return;
                }
                循环前执行函数();
            }
            else if (配置对象[当前脚本名称]?.是否按时执行) {
                当前步骤ID = 0;
                GM_setValue(`当前步骤ID`, 当前步骤ID);
                当前循环次数++;
                GM_setValue(`当前循环次数`, 当前循环次数);
                记录日志函数(`✅ 已执行 ${当前循环次数} 次`, `日志`);
                循环前执行函数();
                return;
            }
            else {
                停止流程函数();
                return;
            }
        }

        if (配置对象[当前脚本名称].步骤[当前步骤ID]?.是否跳过) {
            当前重试次数 = 0;
            GM_setValue(`当前重试次数`, 当前重试次数);
            记录日志函数(`⏩ 跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `日志`);
            // 执行下一步
            当前步骤ID++;
            GM_setValue(`当前步骤ID`, 当前步骤ID);
            是否正在重试 = false;
            GM_setValue(`是否正在重试`, 是否正在重试);
            是否结束等待 = false;
            GM_setValue(`是否结束等待`, 是否结束等待);
            if (当前步骤ID >= 配置对象[当前脚本名称].步骤.length) {
                if (配置对象[当前脚本名称]?.是否循环执行) {
                    当前步骤ID = 0;
                    GM_setValue(`当前步骤ID`, 当前步骤ID);
                    当前循环次数++;
                    GM_setValue(`当前循环次数`, 当前循环次数);
                    记录日志函数(`✅ 完成${当前循环次数}/${脚本循环次数}次循环`, `日志`);
                    if (当前循环次数 >= 脚本循环次数) {
                        停止流程函数();
                        return;
                    }
                    循环前执行函数();
                }
                else if (配置对象[当前脚本名称]?.是否按时执行) {
                    当前步骤ID = 0;
                    GM_setValue(`当前步骤ID`, 当前步骤ID);
                    当前循环次数++;
                    GM_setValue(`当前循环次数`, 当前循环次数);
                    记录日志函数(`✅ 已执行 ${当前循环次数} 次`, `日志`);
                    循环前执行函数();
                    return;
                }
                else {
                    停止流程函数();
                    return;
                }
            }
            setTimeout(执行操作函数, 0);
            return;
        }

        操作前执行函数();

        if (配置对象[当前脚本名称].步骤[当前步骤ID]?.是否跳过) {
            当前重试次数 = 0;
            GM_setValue(`当前重试次数`, 当前重试次数);
            记录日志函数(`⏩ 跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `日志`);
            // 执行下一步
            当前步骤ID++;
            GM_setValue(`当前步骤ID`, 当前步骤ID);
            是否重新执行 = false;
            GM_setValue(`是否重新执行`, 是否重新执行);
            是否正在重试 = false;
            GM_setValue(`是否正在重试`, 是否正在重试);
            是否结束等待 = false;
            GM_setValue(`是否结束等待`, 是否结束等待);
            是否暂停运行 = false;
            GM_setValue(`是否暂停运行`, 是否暂停运行);
            if (当前步骤ID >= 配置对象[当前脚本名称].步骤.length) {
                if (配置对象[当前脚本名称]?.是否循环执行) {
                    当前步骤ID = 0;
                    GM_setValue(`当前步骤ID`, 当前步骤ID);
                    当前循环次数++;
                    GM_setValue(`当前循环次数`, 当前循环次数);
                    记录日志函数(`✅ 完成${当前循环次数}/${脚本循环次数}次循环`, `日志`);
                    if (当前循环次数 >= 脚本循环次数) {
                        停止流程函数();
                        return;
                    }
                    循环前执行函数();
                }
                else if (配置对象[当前脚本名称]?.是否按时执行) {
                    当前步骤ID = 0;
                    GM_setValue(`当前步骤ID`, 当前步骤ID);
                    当前循环次数++;
                    GM_setValue(`当前循环次数`, 当前循环次数);
                    记录日志函数(`✅ 已执行 ${当前循环次数} 次`, `日志`);
                    循环前执行函数();
                    return;
                }
                else {
                    停止流程函数();
                    return;
                }
            }
            setTimeout(执行操作函数, 0);
            return;
        }

        if (是否重新执行) {
            是否重新执行 = false;
            GM_setValue(`是否重新执行`, 是否重新执行);
            是否正在重试 = false;
            GM_setValue(`是否正在重试`, 是否正在重试);
            是否结束等待 = false;
            GM_setValue(`是否结束等待`, 是否结束等待);
            是否暂停运行 = false;
            GM_setValue(`是否暂停运行`, 是否暂停运行);
            setTimeout(执行操作函数, 重新执行等待时间);
            return;
        }

        if (是否暂停运行) {
            记录日志函数(`⏳ 正在暂停`, `日志`);
            暂停执行函数(() => {
                if (!是否正在运行) return;
                记录日志函数(`⏳ 暂停结束`, `日志`);
                元素执行操作函数();
            });
        }
        else {
            元素执行操作函数();
        }

        function 元素执行操作函数() {
            let 元素 = 查找网页元素函数(document, 配置对象[当前脚本名称].步骤[当前步骤ID]);
            if (元素) {
                当前重试次数 = 0;
                GM_setValue(`当前重试次数`, 当前重试次数);
                setTimeout(() => {
                    记录日志函数(`✅ 执行步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `日志`);
                    操作网页元素函数(元素, 配置对象[当前脚本名称].步骤[当前步骤ID]);
                    操作后执行函数();
                    if (是否重新执行) {
                        是否重新执行 = false;
                        GM_setValue(`是否重新执行`, 是否重新执行);
                        是否正在重试 = false;
                        GM_setValue(`是否正在重试`, 是否正在重试);
                        是否结束等待 = false;
                        GM_setValue(`是否结束等待`, 是否结束等待);
                        setTimeout(执行操作函数, 重新执行等待时间);
                    }
                    else {
                        当前步骤ID++;
                        GM_setValue(`当前步骤ID`, 当前步骤ID);
                        是否正在重试 = false;
                        GM_setValue(`是否正在重试`, 是否正在重试);
                        是否结束等待 = false;
                        GM_setValue(`是否结束等待`, 是否结束等待);
                        if (当前步骤ID >= 配置对象[当前脚本名称].步骤.length) {
                            if (配置对象[当前脚本名称]?.是否循环执行) {
                                当前步骤ID = 0;
                                GM_setValue(`当前步骤ID`, 当前步骤ID);
                                当前循环次数++;
                                GM_setValue(`当前循环次数`, 当前循环次数);
                                记录日志函数(`✅ 完成${当前循环次数}/${脚本循环次数}次循环`, `日志`);
                                if (当前循环次数 >= 脚本循环次数) {
                                    停止流程函数();
                                    return;
                                }
                                循环前执行函数();
                            }
                            else if (配置对象[当前脚本名称]?.是否按时执行) {
                                当前步骤ID = 0;
                                GM_setValue(`当前步骤ID`, 当前步骤ID);
                                当前循环次数++;
                                GM_setValue(`当前循环次数`, 当前循环次数);
                                记录日志函数(`✅ 已执行 ${当前循环次数} 次`, `日志`);
                                循环前执行函数();
                                return;
                            }
                            else {
                                停止流程函数();
                                return;
                            }
                        }
                        setTimeout(执行操作函数, 0);
                    }
                }, 操作等待时间 + (配置对象[当前脚本名称]?.步骤[当前步骤ID]?.等待时间 ?? 0));
            }
            else {
                当前重试次数++;
                GM_setValue(`当前重试次数`, 当前重试次数);
                if (配置对象[当前脚本名称].步骤[当前步骤ID]?.重试次数 && 当前重试次数 >= 配置对象[当前脚本名称].步骤[当前步骤ID].重试次数) {
                    if (配置对象[当前脚本名称].步骤[当前步骤ID]?.是否重试失败跳过) {
                        当前重试次数 = 0;
                        GM_setValue(`当前重试次数`, 当前重试次数);
                        if (配置对象[当前脚本名称].步骤[当前步骤ID].选择器 != null) {
                            记录日志函数(`⚠️ 未找到元素选择器：${配置对象[当前脚本名称].步骤[当前步骤ID].选择器}，跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].类名称 != null) {
                            记录日志函数(`⚠️ 未找到元素类名称：${配置对象[当前脚本名称].步骤[当前步骤ID].类名称}，跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素名称 != null) {
                            记录日志函数(`⚠️ 未找到元素名称：${配置对象[当前脚本名称].步骤[当前步骤ID].元素名称}，跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素ID != null) {
                            记录日志函数(`⚠️ 未找到元素ID：${配置对象[当前脚本名称].步骤[当前步骤ID].元素ID}，跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].标签名称 != null) {
                            记录日志函数(`⚠️ 未找到元素标签名称：${配置对象[当前脚本名称].步骤[当前步骤ID].标签名称}，跳过步骤，当前步骤ID：${当前步骤ID}，进度${当前步骤ID + 1}/${配置对象[当前脚本名称].步骤.length}`, `告警`);
                        }
                        当前步骤ID++;
                        GM_setValue(`当前步骤ID`, 当前步骤ID);
                        是否正在重试 = false;
                        GM_setValue(`是否正在重试`, 是否正在重试);
                        是否结束等待 = false;
                        GM_setValue(`是否结束等待`, 是否结束等待);
                        setTimeout(执行操作函数, 0);
                    }
                    else {
                        if (配置对象[当前脚本名称].步骤[当前步骤ID].选择器 != null) {
                            记录日志函数(`❌ 未找到元素选择器：${配置对象[当前脚本名称].步骤[当前步骤ID].选择器}，结束【${当前脚本名称}】`, `报错`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].类名称 != null) {
                            记录日志函数(`❌ 未找到元素类名称：${配置对象[当前脚本名称].步骤[当前步骤ID].类名称}，结束【${当前脚本名称}】`, `报错`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素名称 != null) {
                            记录日志函数(`❌ 未找到元素名称：${配置对象[当前脚本名称].步骤[当前步骤ID].元素名称}，结束【${当前脚本名称}】`, `报错`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素ID != null) {
                            记录日志函数(`❌ 未找到元素ID：${配置对象[当前脚本名称].步骤[当前步骤ID].元素ID}，结束【${当前脚本名称}】`, `报错`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].标签名称 != null) {
                            记录日志函数(`❌ 未找到元素标签名称：${配置对象[当前脚本名称].步骤[当前步骤ID].标签名称}，结束【${当前脚本名称}】`, `报错`);
                        }
                        停止流程函数();
                        return;
                    }
                }
                else {
                    if (!是否正在重试) {
                        是否正在重试 = true;
                        GM_setValue(`是否正在重试`, 是否正在重试);
                        if (配置对象[当前脚本名称].步骤[当前步骤ID].选择器 != null) {
                            记录日志函数(`⚠️ 尝试查找元素选择器：${配置对象[当前脚本名称].步骤[当前步骤ID].选择器}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].类名称 != null) {
                            记录日志函数(`⚠️ 尝试查找元素类名称：${配置对象[当前脚本名称].步骤[当前步骤ID].类名称}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素名称 != null) {
                            记录日志函数(`⚠️ 尝试查找元素名称：${配置对象[当前脚本名称].步骤[当前步骤ID].元素名称}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].元素ID != null) {
                            记录日志函数(`⚠️ 尝试查找元素ID：${配置对象[当前脚本名称].步骤[当前步骤ID].元素ID}`, `告警`);
                        }
                        else if (配置对象[当前脚本名称].步骤[当前步骤ID].标签名称 != null) {
                            记录日志函数(`⚠️ 尝试查找元素标签名称：${配置对象[当前脚本名称].步骤[当前步骤ID].标签名称}`, `告警`);
                        }
                    }
                    setTimeout(执行操作函数, 重试等待时间);
                }
            }
        }
    }

    function 等待执行函数(回调函数) {
        if (配置对象[当前脚本名称]?.步骤[当前步骤ID]?.是否等待条件) {
            let 等待定时器 = setInterval(() => {
                if (页面稳定条件函数() || !是否正在运行) {
                    clearInterval(等待定时器);
                    回调函数();
                }
            }, 100);
        }
        else {
            let 最后改变时间 = Date.now();
            let DOM变动监视器 = new MutationObserver(() => {
                最后改变时间 = Date.now(); // 每次有变化就更新时间
            });

            // 观察整个body的变化
            DOM变动监视器.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });

            let 等待定时器 = setInterval(() => {
                let 当前时间 = Date.now();
                // 等待稳定时间内没有变化，认为页面已稳定（不会检测动态加载的内容）
                if ((当前时间 - 最后改变时间 > 等待稳定时间 + (配置对象[当前脚本名称]?.步骤[当前步骤ID]?.等待稳定时间 ?? 0) && 页面稳定条件函数()) || !是否正在运行) {
                    clearInterval(等待定时器);
                    DOM变动监视器.disconnect();
                    回调函数();
                }
            }, 100);
        }
    }

    function 暂停执行函数(回调函数) {
        let 暂停定时器 = setInterval(() => {
            if (!是否暂停运行 || !是否正在运行) {
                clearInterval(暂停定时器);
                回调函数();
            }
        }, 100);
    }
}

function 修改当前步骤ID函数(步骤ID, 时间) {
    当前步骤ID = 步骤ID;
    GM_setValue(`当前步骤ID`, 当前步骤ID);
    是否重新执行 = true;
    GM_setValue(`是否重新执行`, 是否重新执行);
    是否结束等待 = false;
    GM_setValue(`是否结束等待`, 是否结束等待);
    重新执行等待时间 = 时间;
}

function 检索唯一字符串函数(原字符串, 左字符串, 右字符串) {
    let 字符串起点 = 原字符串.indexOf(左字符串) + 左字符串.length;
    if (字符串起点 < 左字符串.length) return ``;

    let 字符串终点 = 原字符串.indexOf(右字符串, 字符串起点);
    if (字符串终点 === -1) return ``;

    return 原字符串.slice(字符串起点, 字符串终点);
}

function 检索全部字符串函数(原字符串, 左字符串, 右字符串) {
    let 字符串数组 = [];
    let 当前字符串起点 = 0;

    while (当前字符串起点 < 原字符串.length) {
        let 左字符串起点 = 原字符串.indexOf(左字符串, 当前字符串起点);
        if (左字符串起点 === -1) break;

        let 字符串起点 = 左字符串起点 + 左字符串.length;

        let 字符串终点 = 原字符串.indexOf(右字符串, 字符串起点);
        if (字符串终点 === -1) break;

        let 字符串内容 = 原字符串.slice(字符串起点, 字符串终点);
        字符串数组.push(字符串内容);

        当前字符串起点 = 字符串终点 + 右字符串.length;
    }

    return 字符串数组;
}

function 导入数据数组函数(数组对象, 文本数据) {
    Object.keys(数组对象).forEach(数组名称 => {
        数组对象[数组名称].length = 0;
    });
    let 行数组 = 文本数据.split(`\n`);
    行数组.forEach(行 => {
        // 分割每行的数据（按制表符或空格分割）
        let 数据数组 = 行.split(`\t`);

        if (行.split(`\t`).length == Object.keys(数组对象).length) {
            let 数据索引 = 0;
            Object.keys(数组对象).forEach(数组名称 => {
                数组对象[数组名称].push(数据数组[数据索引].trim());
                数据索引++;
            });
            //记录日志函数(`✅ 成功导入：\n${数据数组.slice(0, 数据数组.length).join(`\n`)}`, `日志`);
        }
        else {
            let 数据索引 = 0;
            Object.keys(数组对象).forEach(数组名称 => {
                if (数据索引 < 数据数组.length) {
                    数组对象[数组名称].push(数据数组[数据索引].trim());
                    数据索引++;
                }
                else {
                    数组对象[数组名称].push(``);
                }
            });
            //记录日志函数(`✅ 成功导入：\n${数据数组.slice(0, 数据数组.length).join(`\n`)}`, `告警`);
        }
    });
    记录日志函数(`✅ 成功导入 ${Object.values(数组对象)[0].length} 条数据`, `日志`);
    脚本循环次数 = Object.values(数组对象)[0].length;
    GM_setValue(`脚本循环次数`, 脚本循环次数);
}

function 更新菜单函数() {
    菜单ID数组.forEach(id => GM_unregisterMenuCommand(id));
    菜单ID数组 = [];

    Object.keys(配置对象).forEach(脚本名称 => {
        if (当前脚本名称 == 脚本名称 && 是否正在运行) {
            菜单ID数组.push(GM_registerMenuCommand(`⏹️ 停止【${脚本名称}】`, () => 停止流程函数()));
        }
        else {
            if (!配置对象[脚本名称]?.是否隐藏) {
                let 提示图标 = 配置对象[脚本名称]?.是否循环执行 ? `🔄` : `▶️`;
                菜单ID数组.push(GM_registerMenuCommand(`${提示图标} 启动【${脚本名称}】`, () => {
                    if (当前脚本名称 != ``) {
                        停止流程函数();
                    }
                    当前脚本名称 = 脚本名称;
                    GM_setValue(`当前脚本名称`, 当前脚本名称);
                    启动流程函数();
                }));
            }
        }
    });

    自定义菜单函数();
    菜单ID数组.push(GM_registerMenuCommand(`▶️ 设置线程数【当前：${总线程数}】`, () => {
        测试();
        let 导入数据 = prompt(`设置线程数【当前：${总线程数}】`, ``);
        if (导入数据 && Number(导入数据)) {
            总线程数 = Number(导入数据);
            GM_setValue(`总线程数`, 总线程数);
            记录日志函数(`✅ 总线程数设置为：${总线程数}`, `日志`);
        }
        else {
            记录日志函数(`⚠️ 取消导入数据`, `告警`);
            return;
        }
        更新菜单函数();
    }));
    菜单ID数组.push(GM_registerMenuCommand(`🔍 查看数据`, () => {
        let 当前数据选项 = Object.keys(数据选项对象)[0];

        function 刷新文本区域函数() {
            let 当前数据数组 = [];
            Object.keys(数据选项对象).forEach(数组名称 => {
                if (当前数据选项 == 数组名称) {
                    当前数据数组 = 数据选项对象[数组名称];
                }
            });
            let 文本 = ``;
            for (let i = 0; i < 当前数据数组.length; i++) {
                文本 += 当前数据数组[i] + `\n`;
            }
            日志弹窗.querySelector(`#数据条数`).textContent = `共 ${当前数据数组.length} 条`;
            日志弹窗.querySelector(`#文本区域`).value = 文本;
        }

        let 日志弹窗 = document.createElement(`div`);
        日志弹窗.innerHTML = `
            <style>
                .遮罩 {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.1);
                    z-index: 9998;
                }
                .日志容器 {
                    position: fixed;
                    top: 10%; left: 10%;
                    width: 80%; height: 80%;
                    z-index: 9999;
                    background: white;
                    border: 2px solid #333;
                    padding: 20px;
                    box-shadow: 0 0 20px #000;
                    display: flex;
                    flex-direction: column;
                    border-radius: 8px;
                }
                .标题区域 {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 15px;
                }
                #查看数据下拉框 {
                    padding: 12px 15px; /* 增加内边距 */
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 20px; /* 增大字体大小 */
                    width: 100%; /* 改为100%宽度与文本区域一致 */
                    height: auto;
                    background-color: #f9f9f9;
                    box-sizing: border-box; /* 确保宽度计算包含内边距和边框 */
                }
                .滚动区域 {
                    flex: 1;
                    overflow: hidden;
                    margin-bottom: 15px;
                }
                textarea {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    resize: none;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 15px; /* 增大字体大小 */
                    line-height: 1.5; /* 增加行高提高可读性 */
                }
                .按钮区域 {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .数据条数 {
                    margin-right: auto; /* 将计数信息推到左侧 */
                    padding: 8px 12px;
                    border: 1px solid #ddd; /* 可选边框，与按钮风格协调 */
                    border-radius: 4px;
                    background-color: #f8f9fa; /* 浅灰色背景 */
                    font-size: 20px;
                    color: #666;
                }
                .按钮区域 button {
                    border: 1px solid #ccc;
                    padding: 10px 18px; /* 稍微增大按钮尺寸 */
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px; /* 调整按钮字体大小 */
                }
                .按钮区域 button:hover {
                    background-color: #f0f0f0;
                    border-color: #999;
                }
            </style>
            <div class="遮罩" id="遮罩"></div>
            <div class="日志容器" id="日志容器">
                <div class="标题区域">
                    <select id="查看数据下拉框">
                        ${Object.keys(数据选项对象).map(key => `<option value="${key}">${key}</option>`).join(``)}
                    </select>
                </div>
                <div class="滚动区域">
                    <textarea id="文本区域" readonly></textarea>
                </div>
                <div class="按钮区域">
                    <span class="数据条数" id="数据条数"></span>
                    <button id="复制按钮">复制</button>
                    <button id="关闭按钮">关闭</button>
                </div>
            </div>
            `;

        刷新文本区域函数();
        document.body.appendChild(日志弹窗);
        日志弹窗.querySelector(`#查看数据下拉框`).addEventListener(`change`, () => {
            当前数据选项 = 日志弹窗.querySelector(`#查看数据下拉框`).value;
            刷新文本区域函数();
        });
        日志弹窗.querySelector(`#遮罩`).addEventListener(`click`, () => 日志弹窗.remove());
        日志弹窗.querySelector(`#日志容器`).addEventListener(`click`, (e) => e.stopPropagation());
        日志弹窗.querySelector(`#复制按钮`).addEventListener(`click`, () => {
            GM_setClipboard(日志弹窗.querySelector(`#文本区域`).value);
            let 复制按钮 = 日志弹窗.querySelector(`#复制按钮`);
            let 原文本 = 复制按钮.textContent;
            复制按钮.textContent = `已复制`;
            setTimeout(() => { 复制按钮.textContent = 原文本; }, 1000);
        });
        日志弹窗.querySelector(`#关闭按钮`).addEventListener(`click`, () => 日志弹窗.remove());
    }));
    菜单ID数组.push(GM_registerMenuCommand(`📜 查看日志记录`, () => {
        let 日志弹窗 = document.createElement(`div`);
        日志弹窗.innerHTML = `
            <style>
                .遮罩 {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.1);
                    z-index: 9998;
                }
                .日志容器 {
                    position: fixed;
                    top: 20%; left: 20%;
                    width: 60%; height: 60%;
                    z-index: 9999;
                    background: white;
                    border: 2px solid #333;
                    padding: 10px;
                    box-shadow: 0 0 20px #000;
                    display: flex;
                    flex-direction: column;
                }
                .标题 {
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                .滚动区域 {
                    flex: 1; /* 占据剩余空间 */
                    min-height: 50px;
                    overflow: hidden; /* 隐藏滚动条 */
                }
                textarea {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    resize: none; /* 禁止用户拖拽调整 */
                }
                .按钮区域 {
                    display: flex; /* 弹性布局 */
                    gap: 10px; /* 按钮间距 */
                    padding: 10px 0 0; /* 内边距 */
                    border-top: 1px solid #ddd; /* 上边框 */
                }
                .按钮区域 button {
                    border: 1px solid #ccc;
                    padding: 6px 12px;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .按钮区域 button:hover {
                    border-color: #007bff;
                }
                .按钮区域 button:active {
                    background-color: #f0f0f0;
                }
            </style>
            <div class="遮罩" id="遮罩"></div>
            <div class="日志容器" id="日志容器">
                <div class="标题">
                    <h3>日志记录数组（共${日志记录数组.length}条）</h3>
                </div>
                <div class="滚动区域">
                    <textarea readonly>${日志记录数组.join(`\n`)}</textarea>
                </div>
                <div class="按钮区域">
                    <button id="显示全部按钮">显示全部</button>
                    <button id="仅显示✅按钮">仅显示✅</button>
                    <button id="仅显示🖱️按钮">仅显示🖱️</button>
                    <button id="仅显示❌按钮">仅显示❌</button>
                    <button id="仅显示⚠️按钮">仅显示⚠️</button>
                    <button id="清空按钮">清空</button>
                    <button id="复制按钮">复制</button>
                    <button id="关闭按钮">关闭</button>
                </div>
            </div>
            `;
        document.body.appendChild(日志弹窗);
        日志弹窗.querySelector(`#遮罩`).addEventListener(`click`, () => 日志弹窗.remove());
        日志弹窗.querySelector(`#日志容器`).addEventListener(`click`, (e) => e.stopPropagation());
        日志弹窗.querySelector(`#显示全部按钮`).addEventListener(`click`, () => {
            日志弹窗.querySelector(`textarea`).value = 日志记录数组.join(`\n`);
        });
        日志弹窗.querySelector(`#仅显示✅按钮`).addEventListener(`click`, () => {
            let 文本 = ``;
            for (let i = 0; i < 日志记录数组.length; i++) {
                if (日志记录数组[i].includes(`✅`)) {
                    文本 += 日志记录数组[i] + `\n`;
                }
            }
            日志弹窗.querySelector(`textarea`).value = 文本;
        });
        日志弹窗.querySelector(`#仅显示🖱️按钮`).addEventListener(`click`, () => {
            let 文本 = ``;
            for (let i = 0; i < 日志记录数组.length; i++) {
                if (日志记录数组[i].includes(`🖱️`)) {
                    文本 += 日志记录数组[i] + `\n`;
                }
            }
            日志弹窗.querySelector(`textarea`).value = 文本;
        });
        日志弹窗.querySelector(`#仅显示❌按钮`).addEventListener(`click`, () => {
            let 文本 = ``;
            for (let i = 0; i < 日志记录数组.length; i++) {
                if (日志记录数组[i].includes(`❌`)) {
                    文本 += 日志记录数组[i] + `\n`;
                }
            }
            日志弹窗.querySelector(`textarea`).value = 文本;
        });
        日志弹窗.querySelector(`#仅显示⚠️按钮`).addEventListener(`click`, () => {
            let 文本 = ``;
            for (let i = 0; i < 日志记录数组.length; i++) {
                if (日志记录数组[i].includes(`⚠️`)) {
                    文本 += 日志记录数组[i] + `\n`;
                }
            }
            日志弹窗.querySelector(`textarea`).value = 文本;
        });
        日志弹窗.querySelector(`#清空按钮`).addEventListener(`click`, () => {
            日志记录数组 = [];
            GM_setValue(`日志记录数组`, 日志记录数组);
            日志弹窗.querySelector(`textarea`).value = ``;
        });
        日志弹窗.querySelector(`#复制按钮`).addEventListener(`click`, () => GM_setClipboard(日志弹窗.querySelector(`textarea`).value));
        日志弹窗.querySelector(`#关闭按钮`).addEventListener(`click`, () => 日志弹窗.remove());
    }));
    菜单ID数组.push(GM_registerMenuCommand(`📜 查看报错记录`, () => {
        let 日志弹窗 = document.createElement(`div`);
        日志弹窗.innerHTML = `
            <style>
                .遮罩 {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.1);
                    z-index: 9998;
                }
                .日志容器 {
                    position: fixed;
                    top: 20%; left: 20%;
                    width: 60%; height: 60%;
                    z-index: 9999;
                    background: white;
                    border: 2px solid #333;
                    padding: 10px;
                    box-shadow: 0 0 20px #000;
                    display: flex;
                    flex-direction: column;
                }
                .标题 {
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                .滚动区域 {
                    flex: 1; /* 占据剩余空间 */
                    min-height: 50px;
                    overflow: hidden; /* 隐藏滚动条 */
                }
                textarea {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    resize: none; /* 禁止用户拖拽调整 */
                }
                .按钮区域 {
                    display: flex; /* 弹性布局 */
                    gap: 10px; /* 按钮间距 */
                    padding: 10px 0 0; /* 内边距 */
                    border-top: 1px solid #ddd; /* 上边框 */
                }
                .按钮区域 button {
                    border: 1px solid #ccc;
                    padding: 6px 12px;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .按钮区域 button:hover {
                    border-color: #007bff;
                }
                .按钮区域 button:active {
                    background-color: #f0f0f0;
                }
            </style>
            <div class="遮罩" id="遮罩"></div>
            <div class="日志容器" id="日志容器">
                <div class="标题">
                    <h3>报错记录数组（共${报错记录数组.length}条）</h3>
                </div>
                <div class="滚动区域">
                    <textarea readonly>${报错记录数组.join(`\n`)}</textarea>
                </div>
                <div class="按钮区域">
                    <button id="清空按钮">清空</button>
                    <button id="复制按钮">复制</button>
                    <button id="关闭按钮">关闭</button>
                </div>
            </div>
            `;
        document.body.appendChild(日志弹窗);
        日志弹窗.querySelector(`#遮罩`).addEventListener(`click`, () => 日志弹窗.remove());
        日志弹窗.querySelector(`#日志容器`).addEventListener(`click`, (e) => e.stopPropagation());
        日志弹窗.querySelector(`#清空按钮`).addEventListener(`click`, () => {
            报错记录数组 = [];
            GM_setValue(`报错记录数组`, 报错记录数组);
            日志弹窗.querySelector(`textarea`).value = ``;
        });
        日志弹窗.querySelector(`#复制按钮`).addEventListener(`click`, () => GM_setClipboard(日志弹窗.querySelector(`textarea`).value));
        日志弹窗.querySelector(`#关闭按钮`).addEventListener(`click`, () => 日志弹窗.remove());
    }));
}

function 暂停运行函数() {
    是否暂停运行 = true;
    GM_setValue(`是否暂停运行`, 是否暂停运行);
    let 按钮弹窗 = document.createElement(`div`);
    按钮弹窗.innerHTML = `
        <style>
            #继续按钮 {
                position: fixed;
                top: ${继续按钮坐标数组[0]}%;
                left: ${继续按钮坐标数组[1]}%;
                transform: translate(-50%, -50%); /* 确保按钮中心点对准75%位置 */
                z-index: 9999;
                padding: 12px 22px;
                font-size: 15px;
                color: white;
                background-color: #007bff;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: background-color 0.2s;
            }
            #继续按钮:hover {
                background-color: #0056b3;
            }
        </style>
        <button id="继续按钮">继续</button>
        `;
    document.body.appendChild(按钮弹窗);
    按钮弹窗.querySelector(`#继续按钮`).addEventListener(`click`, () => {
        是否暂停运行 = false;
        GM_setValue(`是否暂停运行`, 是否暂停运行);
        按钮弹窗.remove();
    });
}

function 循环保护函数() {
    if (当前循环保护次数 < 最大循环保护次数) {
        当前循环保护次数++;
        return true;
    }
    else {
        记录日志函数(`❌ 循环次数超过${最大循环保护次数}，强制跳出循环`, `报错`);
        if (当前脚本名称 != ``) {
            停止流程函数();
        }
        return false;
    }
}

function 启动流程函数() {
    if (是否正在运行) return;

    日志记录数组 = [];
    GM_setValue(`日志记录数组`, 日志记录数组);
    报错记录数组 = [];
    GM_setValue(`报错记录数组`, 报错记录数组);

    if (配置对象[当前脚本名称]?.是否确认执行) {
        let 是否确认 = confirm(`确定执行【${当前脚本名称}】？`);
        if (!是否确认) {
            记录日志函数(`⚠️ 取消执行【${当前脚本名称}】`, `告警`);
            当前脚本名称 = ``;
            GM_setValue(`当前脚本名称`, 当前脚本名称);
            return;
        }
    }
    if (配置对象[当前脚本名称]?.是否循环执行) {
        if (!是否跳过获取循环次数 || 脚本循环次数 <= 0) {
            let 新次数 = prompt(`设置循环次数`, 脚本循环次数);

            if (新次数 === null) {
                记录日志函数(`⚠️ 取消执行【${当前脚本名称}】`, `告警`);
                当前脚本名称 = ``;
                GM_setValue(`当前脚本名称`, 当前脚本名称);
                return;
            }

            let 新次数值 = parseInt(新次数);
            if (!isNaN(新次数值) && 新次数值 > 0) {
                脚本循环次数 = 新次数值;
                GM_setValue(`脚本循环次数`, 脚本循环次数);
            }
            else {
                记录日志函数(`❌ 输入无效，取消执行【${当前脚本名称}】`, `报错`);
                alert(`输入无效，取消执行【${当前脚本名称}】`);
                当前脚本名称 = ``;
                GM_setValue(`当前脚本名称`, 当前脚本名称);
                return;
            }
        }
        if (是否跳过获取循环次数) {
            是否跳过获取循环次数 = false;
        }
    }

    是否正在运行 = true;
    GM_setValue(`是否正在运行`, 是否正在运行);
    当前步骤ID = 0;
    GM_setValue(`当前步骤ID`, 当前步骤ID);
    当前循环次数 = 0;
    GM_setValue(`当前循环次数`, 当前循环次数);

    是否重新执行 = false;
    GM_setValue(`是否重新执行`, 是否重新执行);
    是否正在重试 = false;
    GM_setValue(`是否正在重试`, 是否正在重试);
    是否结束等待 = false;
    GM_setValue(`是否结束等待`, 是否结束等待);
    是否暂停运行 = false;
    GM_setValue(`是否暂停运行`, 是否暂停运行);

    启动前执行函数();
    循环前执行函数();

    记录日志函数(`🚀 开始执行【${当前脚本名称}】`, `日志`);
    setTimeout(执行操作函数, 0);
    if (配置对象[当前脚本名称]?.是否按时执行) {
        脚本定时器 = setInterval(执行操作, 配置对象[当前脚本名称].间隔秒数 * 1000);
        GM_setValue(`脚本定时器`, 脚本定时器);
        记录日志函数(`⏱ 已启动脚本定时器，${配置对象[当前脚本名称].间隔秒数}秒/次`, `日志`);
    }
    更新菜单函数();
}

function 停止流程函数() {
    是否正在运行 = false;
    GM_setValue(`是否正在运行`, 是否正在运行);
    if (配置对象[当前脚本名称]?.是否按时执行) {
        clearInterval(脚本定时器);
        脚本定时器 = null;
        GM_setValue(`脚本定时器`, 脚本定时器);
        记录日志函数(`⏹ 脚本定时器已停止`, `日志`);
    }
    记录日志函数(`⏹️ 停止执行【${当前脚本名称}】`, `日志`);
    结束后执行函数();
    if (报错记录数组.length > 0) {
        console.error(`报错记录数组：\n` + 报错记录数组.join(`\n`), new Date().toLocaleTimeString());
    }
    当前脚本名称 = ``;
    GM_setValue(`当前脚本名称`, 当前脚本名称);
    更新菜单函数();
}

function 格式化时间函数(结束时间)//将时间格式化为YYYY-MM-DD字符串
{
    结束时间 = String(结束时间);
    if (结束时间.includes(`年`) || 结束时间.includes(`月`) || 结束时间.includes(`日`)) {
        结束时间 = 结束时间.replaceAll(`年`, `/`).replaceAll(`月`, `/`).replaceAll(`日`, `/`);
    }
    let 标准时间 = new Date(结束时间);
    const 年 = 标准时间.getFullYear();
    const 月 = (标准时间.getMonth() + 1).toString().padStart(2, `0`);
    const 日 = 标准时间.getDate().toString().padStart(2, `0`);
    return `${年}-${月}-${日}`;
}

function 记录日志函数(文本, 类型) {
    if (类型 == `日志`) {
        console.log(文本, new Date().toLocaleTimeString());
    }
    else if (类型 == `告警`) {
        console.warn(文本, new Date().toLocaleTimeString());
    }
    else if (类型 == `报错`) {
        console.error(文本, new Date().toLocaleTimeString());
        报错记录数组.push(`${报错记录数组.length} ${文本} ${new Date().toLocaleTimeString()}`);
        GM_setValue(`报错记录数组`, 报错记录数组);
    }
    日志记录数组.push(`${日志记录数组.length} ${文本} ${new Date().toLocaleTimeString()}`);
    GM_setValue(`日志记录数组`, 日志记录数组);
}

function 初始化函数() {
    更新菜单函数();

    for (let 脚本名称 in 配置对象) {
        if (配置对象.hasOwnProperty(脚本名称) && 配置对象[脚本名称]?.是否立即执行) {
            当前脚本名称 = 脚本名称;
            GM_setValue(`当前脚本名称`, 当前脚本名称);
            启动流程函数();
            break;
        }
    }

    if (是否开启实时定时器) {
        实时定时器 = setInterval(实时判定执行, 实时定时器时间 * 1000);
        GM_setValue(`实时定时器`, 实时定时器);
        记录日志函数(`⏱ 已启动实时定时器，${实时定时器时间}秒/次`, `日志`);
    }
}
