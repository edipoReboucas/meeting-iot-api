const is200 = status => status === 200;

const acceptOnly200 = response => {
  if (is200(response.status)) {
    return response;
  }

  throw new Error('is not 200');
}

const fromJSON = async response => response.json();

module.exports = {
  is200,
  acceptOnly200,
  fromJSON
};
