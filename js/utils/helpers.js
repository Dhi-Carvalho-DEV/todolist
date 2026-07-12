function formatDate(date) {
  if (!date) return "Sem prazo";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function getCategoryLabel(category) {
  switch (category) {
    case "study":
      return "Estudos";

    case "work":
      return "Trabalho";

    case "home":
      return "Casa";

    case "finance":
      return "Finanças";

    default:
      return "Outros";
  }
}
