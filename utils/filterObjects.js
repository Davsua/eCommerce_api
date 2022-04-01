const filterObj = (obj, ...allowedFields) => {
  //rest paramater (...)
  //obj = {title, content, author, ...}
  //allowedfields = [title, content, author]
  const newObj = {}; //funciona como keys, si no encuentra la propiedad en este objeto, no permite el cambio

  Object.keys(obj).forEach((elem) => {
    //keys= le paso un obj y regresa un arreglo solo con los nombres de la spropiedades que contiene ese objeto
    if (allowedFields.includes(elem)) {
      newObj[elem] = obj[elem];
    }
  });

  return newObj;
};

module.exports = { filterObj };
