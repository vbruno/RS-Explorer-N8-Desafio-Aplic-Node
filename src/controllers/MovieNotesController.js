class MovieNotesController {
  create(req, res) {
    res.json({ ok: true });
  }
}

module.exports = new MovieNotesController();
