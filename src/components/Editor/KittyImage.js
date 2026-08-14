import Image from '@tiptap/extension-image';

const KittyImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      caption: {
        default: '',
        parseHTML: element =>
          element.getAttribute('data-caption') || '',
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {};
          }

          return {
            'data-caption': attributes.caption,
          };
        },
      },

      size: {
        default: 'medium',
        parseHTML: element =>
          element.getAttribute('data-size') || 'medium',
        renderHTML: attributes => ({
          'data-size': attributes.size,
        }),
      },

      alignment: {
        default: 'center',
        parseHTML: element =>
          element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => ({
          'data-alignment': attributes.alignment,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const {
      title,
      caption,
      size = 'medium',
      alignment = 'center',
      ...imageAttributes
    } = HTMLAttributes;

    const content = [];

    // TÍTULO: solo aparece si fue escrito
    if (title) {
      content.push([
        'div',
        {
          class: 'kitty-image-title',
        },
        title,
      ]);
    }

    // IMAGEN
    content.push([
      'img',
      {
        ...imageAttributes,
        'data-size': size,
        'data-alignment': alignment,
      },
    ]);

    // PIE DE FOTO: solo aparece si fue escrito
    if (caption) {
      content.push([
        'div',
        {
          class: 'kitty-image-caption',
        },
        caption,
      ]);
    }

    return [
      'div',
      {
        class: `kitty-image kitty-image-${alignment}`,
        'data-size': size,
        'data-alignment': alignment,
      },
      ...content,
    ];
  },
});

export default KittyImage;s