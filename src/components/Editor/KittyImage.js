import Image from '@tiptap/extension-image';

const KittyImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      caption: {
        default: '',
        parseHTML: element => element.getAttribute('data-caption') || '',
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
        parseHTML: element => element.getAttribute('data-size') || 'medium',
        renderHTML: attributes => ({
          'data-size': attributes.size,
        }),
      },

      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => ({
          'data-alignment': attributes.alignment,
        }),
      },
    };
  },

  titleAlignment: {
  default: 'center',
  parseHTML: element => element.getAttribute('data-title-alignment') || 'center',
  renderHTML: attributes => ({
    'data-title-alignment': attributes.titleAlignment,
  }),
},

captionAlignment: {
  default: 'center',
  parseHTML: element => element.getAttribute('data-caption-alignment') || 'center',
  renderHTML: attributes => ({
    'data-caption-alignment': attributes.captionAlignment,
  }),
},

  renderHTML({ HTMLAttributes }) {
    const {
  title,
  'data-caption': caption,
  'data-size': size,
  'data-alignment': alignment,
  'data-title-alignment': titleAlignment,
  'data-caption-alignment': captionAlignment,
  ...imageAttributes
} = HTMLAttributes;

    const children = [
      [
        'img',
        {
          ...imageAttributes,
          ...(title ? { title } : {}),
        },
      ],
    ];

    if (title) {
      children.push([
        'div',
        {
  class: 'kitty-image-title',
  'data-alignment': titleAlignment,
},
        title,
      ]);
    }

    if (caption) {
      children.push([
        'figcaption',
        {
  class: 'kitty-image-caption',
  'data-alignment': captionAlignment,
},
        caption,
      ]);
    }

    return [
      'figure',
      {
        class: 'kitty-image',
        'data-size': size,
        'data-alignment': alignment,
      },
      ...children,
    ];
  },
});

export default KittyImage;

