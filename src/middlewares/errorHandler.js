// Middleware de tratamento de erros
function errorHandler(err, req, res, next) {
  console.error(err.stack); // log no console

  // Se já foi enviado algo, não tenta responder de novo
  if (res.headersSent) {
    return next(err);
  }

  let message = err.message;

  // esconder erros 500
  if (err.status === 500) {
    message = "Erro interno no servidor. Tente novamente mais tarde.";
  }

  res.status(err.status || 500).render("errors/error", {
    message,
    status: err.status || 500
  });
}
module.exports = errorHandler;
