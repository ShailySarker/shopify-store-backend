const getGroupByFormat = (interval) => {
    switch (interval) {
      case "daily":
        return "%Y-%m-%d";
      case "monthly":
        return "%Y-%m";
      case "quarterly":
        return "%Y-Q%q";
      case "yearly":
        return "%Y";
      default:
        return "%Y-%m";
    }
  };
  
  module.exports = { getGroupByFormat };
  