import { escapeHtml } from './escapeHtml.js';

const x = (val) => (val * 128) + 'px';
const y = (val) => (val * 128) + 'px';
const w = (val) => (val * 128) + 'px';
const h = (val) => (val * 128) + 'px';
const fs = (pt) => (pt * 1.77664) + 'px';

// Classic slide chrome uses one 1280 × 720 composition for preview and export.
export function classicSlideMarkup({ theme, isTitle, slide, layoutType, config, renderQuestionContent }) {
    let slideHtml = '';
    const renderGlobalDecorations = () => `
        <div style="position: absolute; left: ${x(-0.5)}; top: ${y(-0.5)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.tealDecor}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(8.5)}; top: ${y(4.125)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.decorPurple}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(0)}; top: ${y(5.5)}; width: ${w(10)}; height: ${h(0.125)}; background-color: #${theme.gold}; opacity: 0.8;"></div>
    `;

    if (theme.classicDesign === 'neon') {
        const isWorkspace = slide?.isWorkspace || false;
        const accentColor = isWorkspace ? theme.gold : theme.cyan;
        const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';
        const qNum = slide?.badge ? slide.badge.replace('Q.', 'Q') : 'Q1';

        const renderModernNeonDecorations = (isTitle = false) => `
            <div style="position: absolute; right: ${x(-1.0)}; top: ${y(isTitle ? -1.5 : -3.5)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.purple}; border: 24px solid #${theme.gold}; border-radius: 50%; opacity: ${isTitle ? 1 : 0.16}; z-index: 0;"></div>
            <div style="position: absolute; left: ${x(-1.5)}; bottom: ${y(isTitle ? -2.0 : -3.0)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.cyan}; border-radius: 50%; opacity: ${isTitle ? 1 : 0.16}; z-index: 0;"></div>
            ${!isTitle ? `<div style="position: absolute; right: ${x(0.5)}; bottom: ${y(0.8)}; font-size: ${fs(150)}; font-weight: bold; color: #${theme.watermark}; opacity: 0.1; z-index: 0; line-height: 1;">${escapeHtml(qNum)}</div>` : ''}
            <div style="position: absolute; left: 0; bottom: 0; width: 40%; height: ${h(0.4)}; background-color: #${theme.magenta}; z-index: 1;"></div>
            <div style="position: absolute; left: 40%; bottom: 0; width: 60%; height: ${h(0.4)}; background-color: #${theme.purple}; z-index: 1;"></div>
        `;

        if (isTitle) {
            slideHtml = `
                ${renderModernNeonDecorations(true)}
                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                    <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                        ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="background-color: #${theme.cyan}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                        <div style="border: 2px solid #${theme.magenta}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.magenta}">${escapeHtml(config?.pill2)}</div>
                    </div>
                    <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                </div>
            `;
        } else {
            let bodyContent = '';
            if (isWorkspace) {
                bodyContent = `
                    <div style="width: 100%; height: 100%; background: repeating-linear-gradient(to bottom, transparent, transparent 49px, #${theme.watermark} 49px, #${theme.watermark} 50px);"></div>
                `;
            } else {
                bodyContent = renderQuestionContent(slide, theme.cyan);
            }

            slideHtml = `
                ${renderModernNeonDecorations()}

                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                    ${isWorkspace
                        ? `<div style="font-size: ${fs(14)}; font-weight: bold; color: #${theme.gold}; padding-right: 15px;">WORK SPACE</div>`
                        : `<div style="background-color: #${theme.cyan}; padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack}; border-radius: 8px 0 0 8px;">${escapeHtml(headerText)}</div>`
                    }
                    <div style="flex-grow: 1; height: 2px; background-color: #${accentColor};"></div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                    ${bodyContent}
                </div>
            `;
        }

        return slideHtml;
    }

    if (theme.classicDesign === 'blueprint') {
        const isWorkspace = slide?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';

        const renderBlueprintDecorations = () => `
            <div style="position: absolute; left: 16px; top: 16px; right: 16px; bottom: 16px; border: 2px solid #${theme.cyan}; z-index: 0; pointer-events: none;"></div>
            <div style="position: absolute; left: 8px; top: 8px; width: 40px; height: 40px; border-top: 4px solid #${theme.orange}; border-left: 4px solid #${theme.orange}; z-index: 1;"></div>
            <div style="position: absolute; right: 8px; bottom: 8px; width: 40px; height: 40px; border-bottom: 4px solid #${theme.orange}; border-right: 4px solid #${theme.orange}; z-index: 1;"></div>
        `;

        if (isTitle) {
            slideHtml = `
                ${renderBlueprintDecorations()}
                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                    <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                        ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="background-color: #${theme.orange}; padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                        <div style="border: 2px solid #${theme.cyan}; padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill2)}</div>
                    </div>
                    <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                </div>
            `;
        } else {
            let bodyContent = '';
            if (isWorkspace) {
                bodyContent = `
                    <div style="width: 100%; height: 100%; background: linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
                `;
            } else {
                bodyContent = renderQuestionContent(slide, theme.cyan);
            }

            slideHtml = `
                ${renderBlueprintDecorations()}

                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                    <div style="background-color: #${theme.orange}; padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack};">${escapeHtml(headerText)}</div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                    ${bodyContent}
                </div>
            `;
        }
        return slideHtml;
    }

    if (theme.classicDesign === 'aurora') {
        const isWorkspace = slide?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';

        const renderAuroraDecorations = () => `
            <div style="position: absolute; left: -100px; top: -100px; width: 400px; height: 400px; background-color: #${theme.blueOrb}; filter: blur(80px); opacity: 0.3; border-radius: 50%; z-index: 0;"></div>
            <div style="position: absolute; right: -100px; bottom: -100px; width: 400px; height: 400px; background-color: #${theme.pinkOrb}; filter: blur(80px); opacity: 0.3; border-radius: 50%; z-index: 0;"></div>
        `;

        if (isTitle) {
            slideHtml = `
                ${renderAuroraDecorations()}
                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                    <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                        ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.pinkOrb}">${escapeHtml(config?.mainTitle2)}</span>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 50px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill1)}</div>
                        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 50px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill2)}</div>
                    </div>
                    <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                </div>
            `;
        } else {
            let bodyContent = '';
            if (isWorkspace) {
                bodyContent = `
                    <div style="width: 100%; height: 100%; background: radial-gradient(#${theme.dot} 2px, transparent 2px); background-size: 40px 40px;"></div>
                `;
            } else {
                bodyContent = renderQuestionContent(slide, theme.textWhite);
            }

            slideHtml = `
                ${renderAuroraDecorations()}

                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                    <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textWhite}; border-radius: 50px;">${escapeHtml(headerText)}</div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                    ${bodyContent}
                </div>
            `;
        }
        return slideHtml;
    }

    if (theme.classicDesign === 'brutalism') {
        const isWorkspace = slide?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';

        const renderNeoBrutalismDecorations = () => `
            <div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 10%; background-color: #${theme.pink}; border-top: 3px solid #${theme.black}; z-index: 1;"></div>
        `;

        const shadowStyle = `box-shadow: 6px 6px 0 0 #${theme.black};`;

        if (isTitle) {
            slideHtml = `
                ${renderNeoBrutalismDecorations()}
                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                    <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textBlack}; text-align: center; margin-bottom: 20px; text-transform: uppercase;">
                        ${escapeHtml(config?.mainTitle1)} <span style="background-color: #${theme.acidGreen}; padding: 0 10px; border: 3px solid #${theme.black}; ${shadowStyle}">${escapeHtml(config?.mainTitle2)}</span>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="background-color: #${theme.acidGreen}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                        <div style="background-color: #${theme.bgColor}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>
                    </div>
                    <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textBlack}; font-weight: bold;">${escapeHtml(config?.footer)}</div>
                </div>
            `;
        } else {
            let bodyContent = '';
            if (isWorkspace) {
                bodyContent = `
                    <div style="width: 100%; height: 100%; background: repeating-linear-gradient(to bottom, transparent, transparent 59px, #${theme.black} 59px, #${theme.black} 60px);"></div>
                `;
            } else {
                bodyContent = renderQuestionContent(slide, theme.textBlack, theme.textBlack, true);
            }

            slideHtml = `
                ${renderNeoBrutalismDecorations()}

                <div style="position: absolute; left: 0; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: 100%; padding: 0 60px; box-sizing: border-box;">
                    <div style="background-color: #${theme.acidGreen}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack};">${escapeHtml(headerText)}</div>
                    <div style="flex-grow: 1; height: 3px; background-color: #${theme.black}; margin: 0 20px;"></div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 10% 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                    ${bodyContent}
                </div>
            `;
        }
        return slideHtml;
    }

    if (!isTitle && slide?.isWorkspace) {
        const workspaceColor = theme.cyan || theme.gold || theme.textWhite;
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.35)}; right: ${x(0.5)}; display: flex; align-items: center; gap: 18px; z-index: 2;">
                <div style="padding: 8px 18px; border: 2px solid #${workspaceColor}; border-radius: 8px; color: #${workspaceColor}; font-size: ${fs(14)}; font-weight: bold; letter-spacing: 1px;">WORK SPACE</div>
                <div style="height: 2px; flex: 1; background: #${workspaceColor}; opacity: 0.7;"></div>
            </div>
            <div style="position: absolute; left: ${x(0.5)}; right: ${x(0.5)}; top: ${y(1.05)}; bottom: ${y(0.55)}; background: repeating-linear-gradient(to bottom, transparent 0, transparent 55px, #${workspaceColor} 56px, transparent 57px); opacity: 0.38;"></div>
        `;
    } else if (isTitle && layoutType === 'modern-sidebar') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
            <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>

            <div style="position: absolute; left: ${x(1.2)}; top: ${y(1.5)}; width: ${w(8)}; height: ${h(1.5)}; font-size: ${fs(54)}; font-weight: bold; display: flex; align-items: center;">
                <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle1)}&nbsp;</span>
                <span style="color: #${theme.gold}">${escapeHtml(config?.mainTitle2)}</span>
            </div>

            <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.0)}; width: ${w(6.5)}; height: ${h(0.04)}; background-color: #${theme.gold}"></div>

            <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
            <div style="position: absolute; left: ${x(4.4)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.bgColor}; border: 3px solid #${theme.purple}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.purple}; box-sizing: border-box;">${escapeHtml(config?.pill2)}</div>
            <div style="position: absolute; left: ${x(1.2)}; top: ${y(4.2)}; width: ${w(8)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 4px; display: flex; align-items: center;">${escapeHtml(config?.footer)}</div>
        `;
    } else if (!isTitle && layoutType === 'modern-sidebar') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
            <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>

            <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
            </div>

            <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                ${renderQuestionContent(slide, theme.cyan)}
            </div>
        `;
    } else if (isTitle && layoutType === 'classic-header') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(2)}; background-color: #${theme.purple}"></div>
            <div style="position: absolute; left: ${x(0)}; top: ${y(1.9)}; width: ${w(10)}; height: ${h(0.1)}; background-color: #${theme.gold}"></div>

            <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.3)}; width: ${w(9)}; height: ${h(1.2)}; font-size: ${fs(45)}; font-weight: bold; display: flex; align-items: center; justify-content: center; text-align: center;">
                <span style="color: #${theme.textBlack}">${escapeHtml(config?.mainTitle1)}&nbsp;</span>
                <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
            </div>

            <div style="position: absolute; left: ${x(2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
            <div style="position: absolute; left: ${x(5.2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>
            <div style="position: absolute; left: ${x(0.5)}; top: ${y(4.5)}; width: ${w(9)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center; justify-content: center;">${escapeHtml(config?.footer)}</div>
        `;
    } else if (!isTitle && layoutType === 'classic-header') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(0.05)}; background-color: #${theme.purple}"></div>
            <div style="position: absolute; left: ${x(0)}; top: ${y(0.05)}; width: ${w(10)}; height: ${h(0.02)}; background-color: #${theme.gold}"></div>

            <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
            </div>

            <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                ${renderQuestionContent(slide, theme.cyan)}
            </div>
        `;
    } else if (isTitle && layoutType === 'split-focus') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(4.5)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
            <div style="position: absolute; left: ${x(4.5)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.gold}"></div>

            <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.0)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
            <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.gold}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>

            <div style="position: absolute; left: ${x(5)}; top: ${y(1.5)}; width: ${w(4.5)}; height: ${h(2)}; font-size: ${fs(49)}; font-weight: bold; display: flex; flex-direction: column; justify-content: center;">
                <span style="color: #${theme.textWhite}">${escapeHtml(config?.mainTitle1)}</span>
                <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
            </div>

            <div style="position: absolute; left: ${x(5)}; top: ${y(4.5)}; width: ${w(4.5)}; height: ${h(0.5)}; font-size: ${fs(14)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center;">${escapeHtml(config?.footer)}</div>
        `;
    } else if (!isTitle && layoutType === 'split-focus') {
        slideHtml = `
            ${renderGlobalDecorations()}
            <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.1)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>

            <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
            </div>

            <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                ${renderQuestionContent(slide, theme.gold)}
            </div>
        `;
    }
    return slideHtml;
}
