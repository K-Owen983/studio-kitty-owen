import Image from '@tiptap/extension-image';

const KittyImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      caption: {
        default: '',
      },

      size: {
        default: 'medium',
      },

      alignment: {
        default: 'center',
      },
    };
  },
});

export default KittyImage;