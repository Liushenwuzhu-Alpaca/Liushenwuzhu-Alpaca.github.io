export interface Project {
  name: string
  url: string
  desc: string
  tags: string[]
}

export const projects: Project[] = [
  {
    name: '个人博客',
    url: 'https://github.com/Liushenwuzhu-Alpaca/Liushenwuzhu-Alpaca.github.io',
    desc: '用 Astro 构建的静态个人站点，记录学习、项目与生活。',
    tags: ['Astro', '静态站', 'GitHub Pages'],
  },
]
