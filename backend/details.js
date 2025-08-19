import book from "./models/book.js";

export const getDetails = async (req, res) => {
    console.log("Fetching book details...");
try {
    const details = await book.find(); // fetch ALL records
    if (!details.length) {
      return res.status(404).json({ message: "No details found" });
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
;
}