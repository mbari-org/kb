import { alpha, styled } from "@mui/material/styles"

const ConceptContent = ({ theme, isSelected }) => {
  return {
    borderRadius: theme.spacing(0.8),
    display: "flex",
    padding: theme.spacing(0.25, 1),
    width: "100%",
    "&:hover": !isSelected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
    variants: [
      {
        props: ({ isSelected }) => isSelected,
        style: {
          backgroundColor: theme.palette.primary.dark,
          border: "1px solid",
          borderColor: theme.palette.common.black,
          color: theme.palette.grey[100],
          ...theme.applyStyles("light", {
            backgroundColor: theme.palette.primary.main,
          }),
        },
      },
    ],
  }
}

export default styled("div")(ConceptContent)
