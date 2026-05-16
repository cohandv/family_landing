/**
 * Order: David → Verónica → Mia → Thiago → Luna
 * Drop individual photos in images/ as david.jpg, veronica.jpg, etc.
 */
window.FAMILY_CONFIG = {
  familyImage: "images/family.png",
};

window.FAMILY_MEMBERS = [
  {
    id: "david",
    name: "David",
    image: "images/david.jpg",
    alternate: false,
    socials: {
      linkedin: "#",
      github: "#",
      telegram: "#",
      facebook: "#",
      instagram: "#",
    },
  },
  {
    id: "veronica",
    name: "Verónica",
    image: "images/veronica.jpg",
    imageFallback: "https://picsum.photos/seed/family-veronica/640/800",
    alternate: true,
    socials: {
      linkedin: "#",
      github: "#",
      telegram: "#",
      facebook: "#",
      instagram: "#",
    },
  },
  {
    id: "mia",
    name: "Mia",
    image: "images/mia.jpg",
    imageFallback: "https://picsum.photos/seed/family-mia/640/800",
    alternate: false,
    socials: {
      linkedin: "#",
      github: "#",
      telegram: "#",
      facebook: "#",
      instagram: "#",
    },
  },
  {
    id: "thiago",
    name: "Thiago",
    image: "images/thiago.jpg",
    imageFallback: "https://picsum.photos/seed/family-thiago/640/800",
    alternate: true,
    socials: {
      linkedin: "#",
      github: "#",
      telegram: "#",
      facebook: "#",
      instagram: "#",
    },
  },
  {
    id: "luna",
    name: "Luna",
    image: "images/luna.jpg",
    imageFallback: "https://picsum.photos/seed/family-luna/640/800",
    alternate: false,
    socials: {
      instagram: "#",
    },
  },
];
