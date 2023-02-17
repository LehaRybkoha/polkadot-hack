const createTrees = (
  title,
  author,
  typeTree,
  img,
  description,
  datePlaced
) => {
  return {
    type: "trees",
    title,
    author,
    typeTree,
    img,
    description,
    datePlaced,
  };
};

const createScience = (
  title,
  author,
  area,
  yearCreation,
  journalName,
  img,
  description,
  { pdf, photos } = {}
) => {
  return {
    type: "science",
    title,
    author,
    area,
    yearCreation,
    journalName,
    pdf,
    img,
    photos,
    description
  };
};

const createPerformance = (title, author, img, { photos, description } = {}) => {
  return {
    title,
    author,
    img,
    description,
    photos
  }
}

export { createPerformance, createScience, createTrees }
