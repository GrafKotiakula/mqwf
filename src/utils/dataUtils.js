import format from 'date-fns/format'
import { isDefined, getValueOrDefault } from './varUtils.js'

const MAIN_RATING = 'Rating'
const GRAPHIC = 'Graphic'
const AUDIO = 'Audio'
const GAMEPLAY = 'Gameplay'
const STORY = 'Story'
const DIFFICULTY = 'Difficulty'
const GRIND = 'Grind'
const GAME_TIME = 'Game time'
const MODS = 'Mods'
const REQUIREMENTS = 'PC requirements'
const BUGS = 'Bugs'
const MTX = 'Microtransactions'
const PRICE = 'Price'

const mainRatingDesc = [ 
  'Terrible', 'Awful', 'Poor', 
  'Below Average', 'Average', 'Okay', 
  'Good', 'Great', 'Excellent', 'Outstanding' ]

const graphicsRatingDesc = [
  'Abysmal', 'Dreadful', 'Poor', 
  'Meh', 'Average', 'Decent', 
  'Good', 'Beautiful', 'Breathtaking', 'Masterpiece' ]
const audioRatingDesc = [
  'Jarring', 'Uninspired', 'Poor', 
  'Meh', 'Average', 'Okay',
  'Immersive', 'Captivating', 'Unforgettable', 'Eargasm' ]
const storyRatingDesc = [
  'No story', 'Nonsensical', 'Incoherent',
  'Uninspired', 'Forgettable', 'Engaging',
  'Lovely', 'Captivating', 'Unforgettable', 'Oscar' ]
const gameplayRatingDesc = [
  'Broken', 'Clunky', 'Repetitive',
  'Meh', 'Just gameplay', 'Satisfying',
  'Fun', 'Deep', 'Innovative', 'Masterful' ]

const difficultyRatingDesc = [
  'Mindless', 'Effortless', 'Straightforward',
  'Manageable', 'Balanced', 'Challenging',
  'Demanding', 'Brutal', 'Punishing', 'Unbeatable' ]
const grindRatingDesc = [
  'No grind', 'Minimal', 'Not much',
  'Light', 'Average', 'Noticeable', 
  'Significant', 'Too much', 'Oppressive', 'Pure grind' ]
const gameTimeRatingDesc = [
  'Ephemeral', 'Fleeting', 'Fugitive',
  'Brief', 'Average', 'Substantial',
  'Lengthy', 'Enormous', 'Immense', 'Endless' ]
const modsRatingDesc = [
  'Vanilla', 'Limited', 'Not much',
  'Suboptimal', 'Enough', 'Rich',
  'Highly', 'Overwhelming', 'Curated chaos', 'Endless' ]

const requirementsRatingDesc = [
  'Potato', 'Frugal', 'Undemanding',
  'Ordinary', 'Moderate', 'Accessible',
  'Demanding', 'Formidable', 'Futureproofed', 'Beyond limits' ]
const bugsRatingDesc = [
  'Pristine', 'Sporadic', 'Minor', 
  'Occasional', 'Noticeable', 'Significant',
  'Glitchy', 'Frustrating', 'Unplayable', 'Infested' ]
const mtxRatingDesc = [
  'Pure', 'Cosmetic only', 'Optional boost',
  'Moderate', 'Noticeable', 'Significant',
  'Grind or pay', 'Pay to win', 'Paywall', 'Nightmare' ]
const priceRatingDesc = [
  'Free', 'Budget buy', 'Cheap',
  'Fair price', 'Worth it', 'Solid purchase',
  'Pricey', 'Sales only', 'Overpriced', 'Rip-off'
]

const getDescription = (value, descArray) => {
  if(value == 0) {
    return 'Unmarked yet'
  } else if (value < 2) {
    return descArray[0]
  } else if (value >= 10) {
    return descArray[9]
  } else {
    value = Math.floor(value) - 1
    return descArray[value]
  }
}

export const getMainRatingDesc = (rating) => getDescription(rating, mainRatingDesc)

export const selectStyle = (rating, {high='', mid='', low='', unmarked=''}) => {
  if (rating == 0) {
    return unmarked 
  } else if (rating >= 7) {
    return high
  } else if (rating >= 4) {
    return mid
  } else/* from 0 to 3 */{
    return low 
  }
}

export const positiveStyleSelector = rating => selectStyle(rating, {high:'good', mid:'average', low:'bad', unmarked:'unmarked'})
export const neutralStyleSelector = rating => selectStyle(rating, {high:'n-high', mid:'n-medium', low:'n-low', unmarked:'unmarked'})
export const negativeStyleSelector = rating => selectStyle(rating, {high:'bad', mid:'average', low:'good', unmarked:'unmarked'})

export const getDescriptionGetter = name => {
  switch(name){
    case MAIN_RATING: return value => getDescription(value, mainRatingDesc)
    case GRAPHIC: return value => getDescription(value, graphicsRatingDesc)
    case AUDIO: return value =>  getDescription(value, audioRatingDesc)
    case GAMEPLAY: return value =>  getDescription(value, gameplayRatingDesc)
    case STORY: return value =>  getDescription(value, storyRatingDesc)
    case DIFFICULTY: return value =>  getDescription(value, difficultyRatingDesc)
    case GRIND: return value =>  getDescription(value, grindRatingDesc)
    case GAME_TIME: return value =>  getDescription(value, gameTimeRatingDesc)
    case MODS: return value =>  getDescription(value, modsRatingDesc)
    case REQUIREMENTS: return value =>  getDescription(value, requirementsRatingDesc)
    case BUGS: return value =>  getDescription(value, bugsRatingDesc)
    case MTX: return value =>  getDescription(value, mtxRatingDesc)
    case PRICE: return value =>  getDescription(value, priceRatingDesc)
    default: return () => 'Unknown'
  }
}

export const getDescriptionByName = (name, value) => getDescriptionGetter(name)(value)

export const positiveRatings = (rating) => ({
  [MAIN_RATING]: getValueOrDefault(rating?.mainRating, 0),
  [AUDIO]: getValueOrDefault(rating?.audio, 0),
  [GRAPHIC]: getValueOrDefault(rating?.graphics, 0),
  [GAMEPLAY]: getValueOrDefault(rating?.gameplay, 0),
  [STORY]: getValueOrDefault(rating?.story, 0),
})

export const neutralRatings = (rating) => ({
  [DIFFICULTY]: getValueOrDefault(rating?.difficulty, 0),
  [GRIND]: getValueOrDefault(rating?.grind, 0),
  [GAME_TIME]: getValueOrDefault(rating?.gameTime, 0),
  [MODS]: getValueOrDefault(rating?.mods, 0),
})

export const negativeRatings = (rating) => ({
  [REQUIREMENTS]: getValueOrDefault(rating?.requirements, 0),
  [BUGS]: getValueOrDefault(rating?.bugs, 0),
  [MTX]: getValueOrDefault(rating?.microtransactions, 0),
  [PRICE]: getValueOrDefault(rating?.price, 0),
})

export const allRatings = (rating) => ({
  ...positiveRatings(rating),
  ...neutralRatings(rating),
  ...negativeRatings(rating)
})

export const restorApiRating = (ratings, obj = {}) => ({
  ...obj,
  mainRating: getValueOrDefault(ratings[MAIN_RATING], 0),
  audio: getValueOrDefault(ratings[AUDIO], 0),
  graphics: getValueOrDefault(ratings[GRAPHIC], 0),
  gameplay: getValueOrDefault(ratings[GAMEPLAY], 0),
  story: getValueOrDefault(ratings[STORY], 0),
  difficulty: getValueOrDefault(ratings[DIFFICULTY], 0),
  grind: getValueOrDefault(ratings[GRIND], 0),
  gameTime: getValueOrDefault(ratings[GAME_TIME], 0),
  mods: getValueOrDefault(ratings[MODS], 0),
  requirements: getValueOrDefault(ratings[REQUIREMENTS], 0),
  bugs: getValueOrDefault(ratings[BUGS], 0),
  microtransactions: getValueOrDefault(ratings[MTX], 0),
  price: getValueOrDefault(ratings[PRICE], 0),
})

export const formattedString = (date, def='Unknown') => isDefined(date) ? format(date, 'd MMMM yyyy') : def
