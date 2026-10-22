import { visit } from 'unist-util-visit'

// 正文图片统一包成 figure（图框样式挂在 figure 上）；alt 为空或以 _ 开头时不生成图注
function createFigure(imgNode, isInGallery = false) {
  const altText = imgNode.properties?.alt
  const shouldSkipCaption = !altText || altText.startsWith('_')
  const children = [imgNode]

  if (!shouldSkipCaption) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: altText }],
    })
  }

  return {
    type: 'element',
    tagName: 'figure',
    properties: isInGallery ? { className: ['gallery-item'] } : {},
    children,
  }
}

export function rehypeImageProcessor() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Skip non-paragraph elements, empty paragraphs, and orphaned nodes
      if (node.tagName !== 'p' || !node.children || node.children.length === 0 || !parent) {
        return
      }

      // Collect images from paragraph
      const imgNodes = []
      for (const child of node.children) {
        if (child.tagName === 'img') {
          imgNodes.push(child)
        }
        else if (child.type !== 'text' || child.value.trim() !== '') {
          return // Skip paragraphs with non-image content
        }
      }

      if (imgNodes.length === 0) {
        return
      }

      const isInGallery = parent?.properties?.className?.includes('gallery-container')

      // Gallery container: convert images to figures
      if (isInGallery) {
        const figures = imgNodes.map(imgNode => createFigure(imgNode, true))
        parent.children.splice(index, 1, ...figures)
        return
      }

      // Single image: convert the paragraph itself into a figure
      if (imgNodes.length === 1) {
        const figure = createFigure(imgNodes[0], false)
        node.tagName = 'figure'
        node.properties = figure.properties
        node.children = figure.children
        return
      }

      // Multiple images: one figure per image in non-gallery containers
      parent.children.splice(index, 1, ...imgNodes.map(imgNode => createFigure(imgNode, false)))
    })
  }
}
