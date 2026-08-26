export interface Friend {
  name: string
  url: string
  avatar?: string
  desc?: string
}

export const friends: Friend[] = [
  {
    name: 'Mirawind\'s Blog',
    url: 'https://mirawind.top/',
    desc: '相寻梦里路，飞雨落花中',
    avatar: 'https://avatars.githubusercontent.com/u/53815918?v=4',
  },
  {
    name: '耶克站',
    url: 'https://brilliant-dango-1b8da7.netlify.app/',
    desc: '这里是耶克个人站，随便了，反正没人看。',
    avatar: 'https://brilliant-dango-1b8da7.netlify.app/assets/images/avatar.jpg',
  },
]
