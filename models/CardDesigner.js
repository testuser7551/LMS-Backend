import mongoose from "mongoose";

const WebcardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  about: {
    basicdetails: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      mobilenumber: { type: Number, default: null },
      jobTitle: { type: String, default: null },
      organization: { type: String, default: null },
      location: { type: String, default: null },
      cardVisibility: { type: Boolean, default: true },
    },
    mainButton: {
      buttonType: {
        type: String,
        enum: ["call", "email", "link", "whatsapp"],
        default: null,
      },
      buttonText: { type: String, default: null },
      buttonInput: { type: String, default: null },
    },
    whatsappButton: {
      whatsappNumber: { type: String, default: null },
      message: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
    },
  },
  content: {
    textSection: {
      heading: { type: String, default: null },
      title: { type: String, default: null },
      content: { type: String, default: null },
      isEnabled: { type: Boolean, default:false },
    },
    linksSection: {
      title: { type: String, default: null },
      link: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
    },
    gallerySections: {
      imgUrl: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
    },


    photoSections: {
      imgUrls: {
        type: [String], // Array of strings
        default: [], // Empty array by default
      },
      isEnabled: { type: Boolean, default: false },
    },

    youtubeSections: {
      title: { type: String, default: null },
      link: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
    },
  },
  style: {
    profileSection: {
      profileImgUrl: { type: String, default: null },
      profileShapes: {
        type: String,
        enum: ["circle", "square"],
        default: "circle",
      },
      profileRingOnPhoto: { type: Boolean, default: false },
      profileVerified: { type: Boolean, default: false },
    },
    bannerImgSection: {
      bannerImgUrl: { type: String, default: null },
    },
    themesSection: {
      themeName: {
        type: String,
        enum: [
          "Simple",
          "Modern",
          "Nature",
          "Bold",
          "Luxury",
          "Playful",
          "Professional",
          "Pastel",
          "Dark",
        ],
      },
      themeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theme",
        default: null,
      },

      // Custom fields
      primaryColor: { type: String, default: null },
      secondaryColor: { type: String, default: null },
      territoryColor: { type: String, default: null },
      backgroundColor: { type: String, default: null },
      textColor: { type: String, default: null },
    },
    headerStyleSection: {
      headerStyle: { type: String, default: null },
    },
    fontStyleSection: {
      font: { type: String, default: null },
    },
  },
  settings: {
    domainUrl: { type: String, default: null },
    removeBranding: { type: Boolean, default: false },
    public: { type: Boolean, default: false },
    showSaveContact: { type: Boolean, default: false },
    emailContact: { type: Boolean, default: false },
    enableExchangeContact: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
});

export default mongoose.model("Webcard", WebcardSchema);
