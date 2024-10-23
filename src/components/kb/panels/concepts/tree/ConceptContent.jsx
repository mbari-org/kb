import { alpha, styled } from "@mui/material/styles"

const ConceptContent = ({ theme, isSelected }) => {
  return {
    borderRadius: theme.spacing(0.8),
    display: "flex",
    flexDirection: "row-reverse",
    fontWeight: 700,
    padding: theme.spacing(0.5, 1),
    width: "100%",
    "&:hover": !isSelected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      fontStyle: "italic",
    },
    variants: [
      {
        props: ({ isSelected }) => isSelected,
        style: {
          backgroundColor: theme.palette.primary.dark,
          border: "1px solid",
          color: theme.palette.primary.contrastText,
          ...theme.applyStyles("light", {
            backgroundColor: theme.palette.primary.main,
          }),
        },
      },
    ],
  }
}

export default styled("div")(ConceptContent)
