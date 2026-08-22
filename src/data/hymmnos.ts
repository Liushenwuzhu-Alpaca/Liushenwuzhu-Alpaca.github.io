export interface HymmnosMotto {
  /** Hymmnos sentence, ASCII only (font covers the full latin glyph set). */
  hm: string
  /** Chinese translation — rendered into aria-label only, never displayed. */
  zh: string
  /** Optional season tag; untagged entries form the evergreen pool. */
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
}

// All sentences verified against the 歌颂之丘 wiki dataset:
// https://wiki.singinghill.top/休姆诺斯数据集
export const hymmnosMottos: HymmnosMotto[] = [
  // Evergreen pool
  { hm: 'Was yea ra chs hymmnos mea', zh: '我很高兴能将自己化为诗歌' }, // AT2 壁画, oldest known sentence (A.D. 0421)
  { hm: 'presia yora chs hymmnos', zh: '愿你成为诗歌' }, // AT2 大地的心脏
  { hm: 'Was yea ra crannidale en tasyue hymmnos tes yor.', zh: '诗之力，为一切生命而存在' }, // AT3 开场动画
  { hm: 'Ma num ra chs pic wasara mea', zh: '我意识到了自己的丰富，并朝更深处前进' }, // 自我领域结束动画
  { hm: 'hYAmmrA ar ciel.', zh: '为了世界拼命咏唱' }, // AT2 克萝洁碑文
  { hm: 'Wee yea ra quel pomb manaf dorn anw ieeya', zh: '带来希望的小小嫩芽，将诞生于世' }, // AT2 开场动画
  { hm: 'Was yea ra hymme an jouee', zh: '与神之力共鸣' }, // AT2 大钟堂骑士团口号
  // Seasonal pool — Finnel's Flipsphere verses
  { hm: 'Rre frawrle wis warma sheak. fowrlle mea.', zh: '春天是温暖的阳光、小鸟的鸣叫。抚慰我的内心', season: 'spring' },
  { hm: 'Rre lirle wis keenis, rre fluy ammue slepir', zh: '夏天是光辉。泉水的声音合上我的眼睑', season: 'summer' },
  { hm: 'Rre ptrapile wis nuih_kierre gyusya enesse oz mea.', zh: '秋天是夜晚时刻，不住吸引着我的内心', season: 'autumn' },
  { hm: 'Rre quivale wis ini kierre, vinan ciel rete crudea', zh: '纯白的世界令人忘却痛苦的回忆，冬天是开始之时', season: 'winter' },
]
