import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;

export const initGA = () => {
  if (GA_ID) {
    ReactGA.initialize(GA_ID);
  }
};

export const trackPage = (page) => {
  if (GA_ID) {
    ReactGA.send({ hitType: "pageview", page });
  }
};
