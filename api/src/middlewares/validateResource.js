const validate = (schema) => (req, res, next) => {
  // TODO : Pourquoi try / catch si pas async ?
  // TODO : Comprendre comment la Fn fonctionne en détails
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    next();
  }
  catch (err) {
    // TODO : Voir gestion de l'erreur
    // => Utiliser json({ status: 'error', error: message })
    return res.status(400)
      .send(err.errors);
  }
};

export default validate;