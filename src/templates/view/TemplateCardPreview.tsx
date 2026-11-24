import { IconLightbulb } from '@shared/view/SvgIcons';
import type { AestheticTemplate } from '@templates/model/templates.model';
import { SCENARIO_DEFINITIONS, templatesService } from '@templates/service/templates.service';

interface TemplateCardPreviewProps {
  template: AestheticTemplate;
}

const MINI_CODE_THEMES = {
  'dark-slate': { bg: '#0f172a', bar: '#1e293b', text: '#cbd5e1', border: '#334155' },
  midnight: { bg: '#09090b', bar: '#18181b', text: '#e4e4e7', border: '#27272a' },
  'emerald-cli': { bg: '#042f2e', bar: '#115e59', text: '#99f6e4', border: '#0f766e' },
  'light-paper': { bg: '#f8fafc', bar: '#e2e8f0', text: '#1e293b', border: '#cbd5e1' },
};

export function TemplateCardPreview({ template }: TemplateCardPreviewProps) {
  const firstScenario = template.scenarios[0] || 'technical-tutorial';
  const scenarioDef = SCENARIO_DEFINITIONS.find((s) => s.key === firstScenario);
  const articleType = scenarioDef?.defaultArticleType || 'tutorial';

  const article = templatesService.resolveArticleAesthetic(template, articleType);
  const h2Blk = templatesService.resolveBlockAesthetic(template, articleType, 'h2');
  const pBlk = templatesService.resolveBlockAesthetic(template, articleType, 'paragraph');
  const calloutBlk = templatesService.resolveBlockAesthetic(template, articleType, 'callout');
  const codeBlk = templatesService.resolveBlockAesthetic(template, articleType, 'code');

  const codePalette = MINI_CODE_THEMES[codeBlk.codeTheme];
  const radius = Math.min(12, Math.max(3, Math.round(article.borderRadius.value * 0.6)));
  const accent = article.accentColor.value;

  const headerStyle = article.headerStyle.value;
  const headerBg =
    headerStyle === 'banner'
      ? `${accent}18`
      : headerStyle === 'split-cover'
        ? article.surfaceSubtle.value
        : 'transparent';

  return (
    <div
      className="tpl-card-preview-canvas"
      style={{
        background: article.surfaceBg.value,
        color: article.textPrimary.value,
        borderColor: article.borderColor.value,
        borderRadius: `${radius}px`,
        fontFamily: article.bodyFont.value,
      }}
    >
      {/* Mini Header (Capa 1 -> Capa 2) */}
      <div
        className={`tpl-mini-header hdr-${headerStyle}`}
        style={{
          background: headerBg,
          borderColor: article.borderColor.value,
          borderRadius:
            headerStyle === 'banner' || headerStyle === 'split-cover'
              ? `${Math.max(3, radius - 2)}px`
              : 0,
        }}
      >
        <span
          className="tpl-mini-badge"
          style={{
            background: `${accent}1e`,
            color: accent,
          }}
        >
          {article.leadBadgeLabel}
        </span>

        <div
          className="tpl-mini-title"
          style={{
            fontFamily: article.headingFont.value,
            color: article.textPrimary.value,
          }}
        >
          {template.name}
        </div>

        {article.showReadingMeta && (
          <div className="tpl-mini-meta-bars">
            <span style={{ background: article.textSecondary.value }} />
            <span style={{ background: accent }} />
          </div>
        )}
      </div>

      {/* Mini Body (Capa 3: H2, Paragraph, Callout, Code) */}
      <div className="tpl-mini-body">
        <div
          className={`tpl-mini-h2 deco-${h2Blk.headingDecoration}`}
          style={{
            fontFamily: h2Blk.fontFamily.value,
            color: h2Blk.textColor.value,
            borderColor: h2Blk.accentColor.value,
          }}
        >
          {h2Blk.headingDecoration === 'numbered-pill' && (
            <span className="tpl-mini-pill" style={{ background: h2Blk.accentColor.value }}>
              01
            </span>
          )}
          <span>Arquitectura de bloques</span>
        </div>

        <div
          className={`tpl-mini-prose style-${pBlk.paragraphStyle}`}
          style={{
            background:
              pBlk.paragraphStyle === 'lead-highlight'
                ? article.surfaceSubtle.value
                : 'transparent',
            borderLeftColor: pBlk.accentColor.value,
          }}
        >
          <div className="tpl-mini-line w-92" style={{ background: article.textSecondary.value }} />
          <div className="tpl-mini-line w-76" style={{ background: article.textSecondary.value }} />
        </div>

        <div
          className={`tpl-mini-callout surf-${calloutBlk.calloutSurface}`}
          style={{
            background:
              calloutBlk.calloutSurface === 'soft-tint' ||
              calloutBlk.calloutSurface === 'banner'
                ? `${calloutBlk.accentColor.value}18`
                : calloutBlk.backgroundColor.value,
            borderColor: calloutBlk.accentColor.value,
            borderRadius: `${Math.min(8, Math.max(2, Math.round(calloutBlk.borderRadius.value * 0.5)))}px`,
          }}
        >
          {calloutBlk.showCalloutIcon && (
            <IconLightbulb size={10} style={{ color: calloutBlk.accentColor.value }} />
          )}
          <span
            className="tpl-mini-callout-bar"
            style={{ background: calloutBlk.accentColor.value }}
          />
        </div>

        <div
          className="tpl-mini-code"
          style={{
            background: codePalette.bg,
            borderColor: codePalette.border,
            borderRadius: `${Math.min(8, Math.max(2, Math.round(codeBlk.borderRadius.value * 0.5)))}px`,
            fontFamily: codeBlk.fontFamily.value,
          }}
        >
          {codeBlk.codeChrome !== 'borderless' && (
            <div
              className="tpl-mini-code-bar"
              style={{ background: codePalette.bar, borderColor: codePalette.border }}
            >
              {codeBlk.codeChrome === 'macos-dots' ? (
                <div className="tpl-mini-dots">
                  <span style={{ background: '#ef4444' }} />
                  <span style={{ background: '#f59e0b' }} />
                  <span style={{ background: '#10b981' }} />
                </div>
              ) : (
                <span className="tpl-mini-code-file" style={{ background: codePalette.text }} />
              )}
              <span
                className="tpl-mini-code-lang"
                style={{ background: codeBlk.accentColor.value }}
              />
            </div>
          )}
          <div className="tpl-mini-code-lines">
            <span style={{ width: '74%', background: codePalette.text }} />
            <span style={{ width: '54%', background: codeBlk.accentColor.value }} />
          </div>
        </div>
      </div>
    </div>
  );
}
