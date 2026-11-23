import type {
  BlockType,
  DocumentStats,
  EditorBlock,
  FontOption,
  ImageSlot,
  PostDocument,
  TypographySettings,
} from '@editor/model/editor.model';
import { coreStorageService } from '@core/service/core-storage.service';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

export const EDITOR_STORAGE_KEY = 'inkstack_cms_mvp_v2';

export const BUILTIN_PROSE_FONTS: FontOption[] = [
  { label: 'Inter (Moderna)', value: "'Inter', sans-serif" },
  { label: 'Plus Jakarta Sans (Editorial Tech)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Space Grotesk (Geométrica)', value: "'Space Grotesk', sans-serif" },
  { label: 'IBM Plex Sans (Técnica)', value: "'IBM Plex Sans', sans-serif" },
  { label: 'Newsreader (Serif Editorial)', value: "'Newsreader', Georgia, serif" },
  { label: 'Lora (Serif Clásica)', value: "'Lora', Georgia, serif" },
  { label: 'Merriweather (Serif Lectura)', value: "'Merriweather', Georgia, serif" },
];

export const BUILTIN_CODE_FONTS: FontOption[] = [
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Fira Code', value: "'Fira Code', monospace" },
  { label: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { label: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
];

export const CODE_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'bash',
  'json',
  'sql',
  'html',
  'css',
  'go',
  'rust',
  'plaintext',
];

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: '¶ Párrafo',
  h2: 'H2 Encabezado',
  h3: 'H3 Subsección',
  code: '</> Bloque de código',
  callout: '💡 Callout / Nota',
  list: '• Lista',
  quote: '❝ Cita',
  image: '🖼 Imágenes',
  divider: '— Separador',
};

export function createSamplePost(): PostDocument {
  return {
    title: 'Caching HTTP en APIs modernas: ETag, Cache-Control y validación condicional',
    excerpt:
      'Aprende a reducir la latencia y ahorrar ancho de banda combinando cabeceras de caché estándar con validación condicional en Node.js y TypeScript.',
    coverEnabled: true,
    coverImage: '',
    status: 'draft',
    slug: 'caching-http-apis-etag-cache-control',
    category: 'Backend & APIs',
    tags: ['http', 'typescript', 'performance', 'nodejs'],
    author: 'Rodrigo Mijangos',
    date: new Date().toISOString().slice(0, 10),
    seoTitle: 'Guía de Caching HTTP con ETag y Cache-Control en TypeScript',
    seoDesc:
      'Implementa respuestas 304 Not Modified y cabeceras Cache-Control paso a paso para acelerar tus APIs REST.',
    showToc: true,
    typography: {
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      codeFont: "'JetBrains Mono', monospace",
      fontSize: 16,
      lineHeight: 1.75,
      customFonts: [],
    },
    blocks: [
      {
        id: 'b1',
        type: 'paragraph',
        text: 'Uno de los errores más comunes al diseñar APIs informativas o de catálogo es devolver siempre la carga completa con estado `200 OK`, incluso cuando el recurso no ha cambiado. Con **ETag** y `Cache-Control`, el navegador o CDN puede reutilizar respuestas o validarlas con un costo mínimo.',
      },
      {
        id: 'b2',
        type: 'callout',
        variant: 'info',
        title: '¿Cuándo usar ETag frente a max-age?',
        text: 'Usa `max-age` cuando el dato tolera cierto desfase temporal. Combínalo con `ETag` cuando necesites frescura inmediata sin reenviar payloads pesados si el contenido sigue intacto.',
      },
      {
        id: 'b3',
        type: 'h2',
        text: '1. Middleware de validación condicional en Express',
      },
      {
        id: 'b4',
        type: 'paragraph',
        text: 'El siguiente ejemplo calcula un hash corto sobre la respuesta serializada y lo compara contra la cabecera `If-None-Match` enviada por el cliente:',
      },
      {
        id: 'b5',
        type: 'code',
        language: 'typescript',
        filename: 'src/middleware/etagCache.ts',
        highlightLines: '5, 10-13',
        showLineNumbers: true,
        caption: 'Middleware ligero que devuelve 304 Not Modified cuando el hash coincide.',
        code: `import crypto from 'node:crypto';
import type { Request, Response } from 'express';

export function sendWithETag(req: Request, res: Response, payload: unknown) {
  const body = JSON.stringify(payload);
  const etag = '"' + crypto.createHash('sha1').update(body).digest('hex') + '"';

  res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  return res.status(200).type('application/json').send(body);
}`,
      },
      {
        id: 'b6',
        type: 'h2',
        text: '2. Verificar el comportamiento desde terminal',
      },
      {
        id: 'b7',
        type: 'paragraph',
        text: 'Puedes probar el flujo completo usando `curl` en dos peticiones consecutivas para confirmar la respuesta `304`:',
      },
      {
        id: 'b8',
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        highlightLines: '4',
        showLineNumbers: true,
        caption: 'La segunda petición envía If-None-Match y evita transferir el cuerpo JSON.',
        code: `# 1) Obtener recurso y leer cabecera ETag
curl -i http://localhost:3000/api/posts/guia-http

# 2) Revalidar con el ETag recibido
curl -i -H 'If-None-Match: "9f86d081884c7d659a2feaa0c55ad015"' \\
  http://localhost:3000/api/posts/guia-http`,
      },
      {
        id: 'b9',
        type: 'h3',
        text: 'Buenas prácticas en producción',
      },
      {
        id: 'b10',
        type: 'list',
        ordered: false,
        text: '- Evita `ETag` en respuestas que cambian por usuario si no incluyes `Vary: Authorization`.\n- Prefiere `stale-while-revalidate` en contenido editorial para servir al instante desde CDN.\n- Monitoriza la tasa de `304 Not Modified` para medir ahorro real de egress.',
      },
      {
        id: 'b11',
        type: 'quote',
        text: 'La petición más rápida es la que no necesita volver a serializar ni transferir bytes por la red.',
        cite: 'Principio de rendimiento web',
      },
    ],
  };
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const editorDocumentService = {
  createImageSlot(): ImageSlot {
    return {
      id: sharedUtilsService.uid('img'),
      url: '',
      alt: '',
      caption: '',
      width: 70,
      anchor: 'center',
    };
  },

  createBlock(type: BlockType): EditorBlock {
    const id = sharedUtilsService.uid('b');
    switch (type) {
      case 'h2':
        return { id, type: 'h2', text: '' };
      case 'h3':
        return { id, type: 'h3', text: '' };
      case 'code':
        return {
          id,
          type: 'code',
          language: 'typescript',
          filename: 'ejemplo.ts',
          highlightLines: '',
          showLineNumbers: true,
          caption: '',
          code: '',
        };
      case 'callout':
        return { id, type: 'callout', variant: 'info', title: 'Nota técnica', text: '' };
      case 'list':
        return { id, type: 'list', ordered: false, text: '- Primer punto\n- Segundo punto' };
      case 'quote':
        return { id, type: 'quote', text: '', cite: '' };
      case 'image':
        return { id, type: 'image', images: [this.createImageSlot()] };
      case 'divider':
        return { id, type: 'divider' };
      default:
        return { id, type: 'paragraph', text: '' };
    }
  },

  loadDocument(): PostDocument {
    const parsed = coreStorageService.getItem<PostDocument>(EDITOR_STORAGE_KEY);
    if (!parsed) return createSamplePost();

    const fallbackTypo = createSamplePost().typography;
    return {
      ...createSamplePost(),
      ...parsed,
      coverEnabled: typeof parsed.coverEnabled === 'boolean' ? parsed.coverEnabled : true,
      typography: {
        ...fallbackTypo,
        ...(parsed.typography || {}),
        customFonts: Array.isArray(parsed.typography?.customFonts)
          ? parsed.typography.customFonts
          : [],
      },
      blocks: Array.isArray(parsed.blocks) && parsed.blocks.length
        ? parsed.blocks.map((b) => {
            if (b.type === 'image' && (!Array.isArray(b.images) || !b.images.length)) {
              return { ...b, images: [this.createImageSlot()] };
            }
            return b;
          })
        : [this.createBlock('paragraph')],
    };
  },

  saveDocument(doc: PostDocument): boolean {
    return coreStorageService.setItem(EDITOR_STORAGE_KEY, doc);
  },

  computeStats(doc: PostDocument): DocumentStats {
    let words = 0;
    let codeBlocks = 0;
    words += (doc.title || '').trim().split(/\s+/).filter(Boolean).length;
    words += (doc.excerpt || '').trim().split(/\s+/).filter(Boolean).length;

    doc.blocks.forEach((b) => {
      if (b.type === 'code') {
        codeBlocks += 1;
        words += Math.round((b.code || '').trim().split(/\s+/).filter(Boolean).length * 0.5);
      } else if (b.text) {
        words += b.text.trim().split(/\s+/).filter(Boolean).length;
      }
    });

    return {
      words,
      readTime: Math.max(1, Math.ceil(words / 200)),
      codeBlocks,
      totalBlocks: doc.blocks.length,
    };
  },

  formatInlineMarkdown(raw: string): string {
    let html = escapeHtml(raw);
    const codeTokens: string[] = [];
    html = html.replace(/`([^`]+)`/g, (_match, code: string) => {
      const idx = codeTokens.length;
      codeTokens.push(`<code class="inline-code">${code}</code>`);
      return `@@CODE_${idx}@@`;
    });
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+|#)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/@@CODE_(\d+)@@/g, (_m, i: string) => codeTokens[Number(i)] || '');
    return html;
  },

  domToInlineMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    const inner = Array.from(el.childNodes).map((c) => this.domToInlineMarkdown(c)).join('');
    if (tag === 'strong' || tag === 'b') return inner ? `**${inner}**` : '';
    if (tag === 'em' || tag === 'i') return inner ? `*${inner}*` : '';
    if (tag === 'code') return inner ? `\`${inner}\`` : '';
    if (tag === 'a') return `[${inner}](${el.getAttribute('href') || '#'})`;
    if (tag === 'div' || tag === 'p') return inner ? `\n${inner}` : '';
    return inner;
  },

  cleanInlineDom(el: HTMLElement): string {
    return this.domToInlineMarkdown(el)
      .replace(/^\n+/, '')
      .replace(/\n{3,}/g, '\n\n');
  },

  parseHighlightLines(spec?: string): Set<number> {
    const set = new Set<number>();
    if (!spec) return set;
    spec.split(',').forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      if (trimmed.includes('-')) {
        const [a, b] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!Number.isNaN(a) && !Number.isNaN(b)) {
          for (let i = Math.min(a, b); i <= Math.max(a, b); i += 1) {
            set.add(i);
          }
        }
      } else {
        const n = parseInt(trimmed, 10);
        if (!Number.isNaN(n)) set.add(n);
      }
    });
    return set;
  },

  highlightCode(code: string, lang?: string): string {
    const l = (lang || 'plaintext').toLowerCase();
    const sqlWords =
      'SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|ON|GROUP|BY|ORDER|LIMIT|AS|AND|OR|NOT|NULL|PRIMARY|KEY';
    const kwMap: Record<string, string> = {
      javascript:
        'import|export|from|const|let|var|function|return|if|else|for|while|async|await|try|catch|throw|new|class|extends|typeof|null|undefined|true|false',
      typescript:
        'import|export|from|const|let|var|function|return|if|else|for|while|async|await|try|catch|throw|new|class|extends|type|interface|implements|enum|as|unknown|any|string|number|boolean|void|null|undefined|true|false',
      python:
        'def|class|return|if|elif|else|for|while|import|from|as|with|try|except|raise|pass|yield|async|await|lambda|None|True|False|and|or|not|in|is',
      sql: `${sqlWords}|${sqlWords.toLowerCase()}`,
      bash: 'curl|npm|npx|pnpm|yarn|git|docker|cd|ls|mkdir|rm|echo|export|cat|grep|sudo|chmod|chown|node|python',
      go: 'package|import|func|return|if|else|for|range|var|const|type|struct|interface|go|defer|chan|map|nil|true|false',
      rust: 'fn|let|mut|pub|use|mod|struct|enum|impl|trait|for|in|if|else|match|return|async|await|true|false|Some|None|Ok|Err',
    };

    const keywords = kwMap[l] || kwMap.typescript;
    const tokenRegex = new RegExp(
      [
        '(\\/\\/[^\\n]*|#[^\\n]*|--[^\\n]*)',
        '(\\/\\*[\\s\\S]*?\\*\\/)',
        '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)',
        '\\b(\\d+(?:\\.\\d+)?)\\b',
        `\\b(${keywords})\\b`,
        '\\b([A-Z][A-Za-z0-9_]*)\\b',
        '\\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*\\()',
      ].join('|'),
      'g',
    );

    let result = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(code.slice(lastIndex, match.index));
      }
      const full = escapeHtml(match[0]);
      if (match[1] || match[2]) result += `<span class="tok-cmt">${full}</span>`;
      else if (match[3]) result += `<span class="tok-str">${full}</span>`;
      else if (match[4]) result += `<span class="tok-num">${full}</span>`;
      else if (match[5]) result += `<span class="tok-kw">${full}</span>`;
      else if (match[6]) result += `<span class="tok-type">${full}</span>`;
      else if (match[7]) result += `<span class="tok-fn">${full}</span>`;
      else result += full;
      lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < code.length) {
      result += escapeHtml(code.slice(lastIndex));
    }
    return result;
  },

  toMarkdown(doc: PostDocument): string {
    const fm = [
      '---',
      `title: "${(doc.title || '').replace(/"/g, '\\"')}"`,
      `slug: "${doc.slug || sharedUtilsService.slugify(doc.title)}"`,
      `status: "${doc.status}"`,
      `category: "${doc.category}"`,
      `tags: [${(doc.tags || []).map((t) => `"${t}"`).join(', ')}]`,
      `author: "${doc.author}"`,
      `date: "${doc.date}"`,
      '---',
      '',
    ].join('\n');

    const body = doc.blocks
      .map((b) => {
        if (b.type === 'paragraph') return b.text || '';
        if (b.type === 'h2') return `## ${b.text || ''}`;
        if (b.type === 'h3') return `### ${b.text || ''}`;
        if (b.type === 'list') return b.text || '';
        if (b.type === 'quote') return `> ${b.text || ''}${b.cite ? `\n>\n> — ${b.cite}` : ''}`;
        if (b.type === 'callout') {
          return `> **[${(b.variant || 'info').toUpperCase()}] ${b.title || ''}**\n> ${b.text || ''}`;
        }
        if (b.type === 'image') {
          return (b.images || [])
            .filter((i) => i.url)
            .map((i) => `![${i.alt || ''}](${i.url})${i.caption ? `\n*${i.caption}*` : ''}`)
            .join('\n\n');
        }
        if (b.type === 'divider') return '---';
        if (b.type === 'code') {
          const meta = b.filename ? ` title="${b.filename}"` : '';
          return `\`\`\`${b.language || ''}${meta}\n${b.code || ''}\n\`\`\``;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');

    return fm + (doc.excerpt ? `${doc.excerpt}\n\n` : '') + body;
  },

  applyTypographyToDom(typography: TypographySettings): void {
    let styleEl = document.getElementById('customFontsStyle') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'customFontsStyle';
      document.head.appendChild(styleEl);
    }

    document.querySelectorAll('link[data-custom-gfont]').forEach((el) => el.remove());

    let css = '';
    (typography.customFonts || []).forEach((f) => {
      if (f.sourceType === 'google') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = f.value;
        link.dataset.customGfont = f.id;
        document.head.appendChild(link);
      } else if (f.sourceType === 'file') {
        css += `@font-face { font-family: "${f.name}"; src: url("${f.value}"); font-display: swap; }\n`;
      }
    });
    styleEl.textContent = css;

    const root = document.documentElement;
    root.style.setProperty('--preview-heading-font', typography.headingFont || "'Inter', sans-serif");
    root.style.setProperty('--preview-body-font', typography.bodyFont || "'Inter', sans-serif");
    root.style.setProperty('--preview-code-font', typography.codeFont || "'JetBrains Mono', monospace");
    root.style.setProperty('--preview-font-size', `${typography.fontSize || 16}px`);
    root.style.setProperty('--preview-line-height', String(typography.lineHeight || 1.75));
  },
};
