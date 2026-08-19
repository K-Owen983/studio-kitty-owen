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

  renderHTML({ HTMLAttributes }) {
  const {
    title,
    'data-caption': caption,
    'data-size': size,
    'data-alignment': alignment,
    ...imageAttributes
  } = HTMLAttributes;

  const children = [
    [
      'img',
      {
        ...imageAttributes,
        ...(title ? { title } : {}),
        ...(caption ? { 'data-caption': caption } : {}),
        ...(size ? { 'data-size': size } : {}),
        ...(alignment ? { 'data-alignment': alignment } : {}),
      },
    ],
  ];

  if (title) {
    children.push([
      'div',
      {
        class: 'kitty-image-title',
      },
      title,
    ]);
  }

  if (caption) {
    children.push([
      'figcaption',
      {
        class: 'kitty-image-caption',
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

    if (title) {
      children.push([
        'div',
        {
          class: 'kitty-image-title',
        },
        title,
      ]);
    }

    if (caption) {
      children.push([
        'figcaption',
        {
          class: 'kitty-image-caption',
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

