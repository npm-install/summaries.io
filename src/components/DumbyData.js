// Desktop Content Provider Component
const article1 = {
  title: `This Cryptocurrency Miner Says It Solved Bitcoin's Power Problem`,
  url:
    "https://www.bloomberg.com/news/articles/2017-11-16/this-cryptocurrency-miner-says-it-solved-bitcoin-s-power-problem",
  summary: `Enter HydroMiner, a six-person startup that's already running cryptocurrency servers at two disused Austrian hydropower mills.`
};

const article2 = {
  title: `Google Has Picked an Answer for You—Too Bad It’s Often Wrong`,
  url:
    "https://www.wsj.com/articles/googles-featured-answers-aim-to-distill-truthbut-often-get-it-wrong-1510847867",
  summary: `Now, for many queries, the internet giant is presenting itself as the authority on truth by promoting a single search result as the answer. To the question "Does money buy happiness?" Google recently highlighted a result that stated: "There is enough scientific research to prove" it.
  `
};

const article3 = {
  title: `Trump blasts Franken, but stays silent on Moore`,
  url:
    "http://www.cnn.com/2017/11/17/politics/donald-trump-al-franken-roy-moore/index.html",
  summary: `When the allegations first surfaced, White House press secretary Sarah Sanders said in a statement on behalf of the President that Moore should drop out if the allegations of sexual misconduct leveled against him are true, but Trump, himself, has declined to comment further and ignored several shouted questions from reporters when asked whether Moore should drop out of the race.
  `
};

const article4 = {
  title: `Inside the First Church of Artificial Intelligence`,
  url:
    "https://www.wired.com/story/anthony-levandowski-artificial-intelligence-religion/",
  summary: `During our three-hour interview, Levandowski made it absolutely clear that his choice to make WOTF a church rather than a company or a think tank was no prank.
  `
};

const article5 = {
  title: `Caring for Your New Office Woman`,
  url:
    "https://www.newyorker.com/humor/daily-shouts/caring-for-your-new-office-woman",
  summary: `If your Office Woman's mood begins to change, check in: Have you been touching your Office Woman, making sexually suggestive comments, or inviting your Office Woman to non-office locations in order to "See how you vibe"? While these might seem like ways to motivate your Office Woman, many men are surprised to learn that they're actually inappropriate, unwanted, and illegal! If it helps, think of your Office Woman like a normal, male co-worker.
  `
};

const contentData = {
  name: "Hacker News",
  imgURL:
    "https://lh4.ggpht.com/bIdMYBlsMzCcUYzluebQqK3vgofN_8gz49OzC1uzlWnZC5NfCO3LvH7TcX39giArHg=w300",
  description:
    "Social news website focusing on computer science and entrepreneurship",
  articles: [article1, article2, article3, article4, article5]
};

export const sources = [
  {
    img: 'https://lh4.ggpht.com/bIdMYBlsMzCcUYzluebQqK3vgofN_8gz49OzC1uzlWnZC5NfCO3LvH7TcX39giArHg=w300',
    name: 'Hacker News',
    des: 'Social news website focusing on computer science and entrepreneurship'
  },
  {
    img: 'https://pbs.twimg.com/profile_images/900059590586486784/fmY_4l3f_400x400.jpg',
    name: 'The New Yorker',
    des: 'A mix of reporting on politics and culture, humor and cartoons, fiction and poetry, and reviews and criticism'
  },
  {
    img: 'http://cdn.cnn.com/cnn/.e/img/3.0/global/misc/cnn-logo.png',
    name: 'CNN',
    des: 'Breaking news today for U.S., world, weather, entertainment, politics and health'
  },
  {
    img: 'https://lh3.googleusercontent.com/qF9y0xIiYo_dk0JpryEl-lT2wJMDmz7groOBXqkalFg1SWPLklhuAUp0jIjoSLxDEi4=w300',
    name: 'Medium',
    des: 'Online publishing platform to read, write, and interact with the stories that matter most to you.'
  },
  {
    img: 'https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/052016/untitled-1_242.png?itok=nRWq5scp',
    name: 'ESPN',
    des: 'Get up-to-the-minute sports news coverage, scores, highlights and commentary'
  }
];

export default contentData;
