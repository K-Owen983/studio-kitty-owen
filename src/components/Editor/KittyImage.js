import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

function KittyImageView({ node }) {
  const {
    src,
    alt,
    title,
    caption,
    size,
    alignment,
  } = node.attrs;

  return (
    <NodeViewWrapper
      as="figure"
      className="kitty-image"
      data-size={size}
      data-alignment={alignment}
    >
      {title && (
        <div className="kitty-image-title">
          {title}
        </div>
      )}

      <img
        src={src}
        alt={alt || ''}
      />

      {caption && (
        <figcaption className="kitty-image-caption">
          {caption}
        </figcaption>
      )}
    </NodeViewWrapper>
  );
}

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

  addNodeView() {
    return ReactNodeViewRenderer(KittyImageView);
  },

  renderHTML({ HTMLAttributes }) {
    const {
      title,
      caption,
      size,
      alignment,
      ...imageAttributes
    } = HTMLAttributes;

    const children = [];

    if (title) {
      children.push([
        'div',
        {
          class: 'kitty-image-title',
        },
        title,
      ]);
    }

    children.push([
      'img',
      {
        ...imageAttributes,
        ...(title ? {} : {}),
      },
    ]);

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