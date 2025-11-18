import { AiOutlineStock } from "react-icons/ai";
import {
  MdAccountBalanceWallet,
  MdFormatListNumbered,
  MdManageHistory,
  MdOutlineDonutSmall,
  MdSettings,
  MdOutlineEmojiTransportation,
  MdOutlineCreateNewFolder,
} from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { CgShutterstock } from "react-icons/cg";
import { FaProductHunt, FaSellcast } from "react-icons/fa";
import { CiBasketball } from "react-icons/ci";
import {
  FaCommentSms,
  FaGear,
  FaGears,
  FaServicestack,
  FaUsers,
} from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirbnb } from "react-icons/tb";
import { MdOutlinePermMedia } from "react-icons/md";
import { FaDelicious } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { LiaBlogSolid } from "react-icons/lia";
import { CiCompass1 } from "react-icons/ci";
import { MdWebAssetOff } from "react-icons/md";
import { BsFillFileEarmarkRuledFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import {
  GiCarWheel,
  GiCash,
  GiChatBubble,
  GiVerticalBanner,
} from "react-icons/gi";
import { FaFeather } from "react-icons/fa";
import { SiJetpackcompose } from "react-icons/si";
import { FcSalesPerformance } from "react-icons/fc";
import { PiStudentBold } from "react-icons/pi";
import { IoPersonAddSharp, IoSettingsSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { MdCoPresent } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { RiBankFill } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import { AiOutlineTransaction } from "react-icons/ai";
import { LuLayoutTemplate } from "react-icons/lu";

export const privateRouteNames = [
  "Services",
  "Category",
  "Delivery",
  "Customer",
  "Users",
  "Company rules",
  "Company names",
  "Banners",
];

export const SidebarItemsData = [
  {
    id: 1,
    name: "Home Page",
    module_id: 1,
    path: "",
    Icon: <MdOutlineCategory size={20} />,
    sub: [
      {
        id: 1,
        name: "Home Hero",
        path: "/home-page/home-hero/all-home-heros",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "Education",
        path: "/home-page/education/all-educations",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
      {
        id: 3,
        name: "Home About",
        path: "/home-page/home-about/all-home-abouts",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 4,
        name: "Experience",
        path: "/home-page/experience/all-experiences",
        module_id: 1,
        Icon: <LuLayoutTemplate size={20} />,
      },
      {
        id: 5,
        name: "Skills",
        path: "/home-page/skill/all-skills",
        module_id: 1,
        Icon: <IoSettingsSharp size={20} />,
      },
      {
        id: 6,
        name: "Skills Category",
        path: "/home-page/skills-category/all-skills-categories",
        module_id: 1,
        Icon: <IoSettingsSharp size={20} />,
      },
      {
        id: 7,
        name: "Collaborating",
        path: "/home-page/collaborating/all-collaborating",
        module_id: 1,
        Icon: <IoSettingsSharp size={20} />,
      },
      {
        id: 7,
        name: "Collaborate",
        path: "/home-page/collaborates/all-collaborates",
        module_id: 1,
        Icon: <IoSettingsSharp size={20} />,
      },
    ],
  },
  {
    id: 2,
    name: "About Page",
    module_id: 1,
    path: "",
    Icon: <AiOutlineTransaction size={20} />,
    sub: [
      {
        id: 1,
        name: "About Me",
        path: "/about-page/about-me/all-about-me",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "My Hobbies",
        path: "/about-page/my-hobby/all-my-hobbies",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
      {
        id: 3,
        name: "Snapshots Category",
        path: "/about-page/snapshot-category/all-snapshot-categories",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 4,
        name: "Snapshots",
        path: "/about-page/snapshots/all-snapshots",
        module_id: 1,
        Icon: <LuLayoutTemplate size={20} />,
      },
    ],
  },

  {
    id: 9,
    name: "Section Title & Description",
    module_id: 1,
    path: "/section-description/all-section-descriptions",
    Icon: <GiReturnArrow size={20} />,
  },
  {
    id: 10,
    name: "Inbox Message",
    module_id: 1,
    path: "/send-meaage/all-inbox-message",
    Icon: <GiReturnArrow size={20} />,
  },
  {
    id: 11,
    name: "Professors",
    module_id: 1,
    path: "/professors/all-professors",
    Icon: <GiReturnArrow size={20} />,
  },
];
