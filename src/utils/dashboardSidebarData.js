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

export const SidebarItemsData = [
  {
    id: 1,
    name: "Team Member",
    module_id: 1,
    path: "",
    Icon: <MdOutlineCategory size={20} />,
    sub: [
      {
        id: 1,
        name: "All Team Mebmers",
        path: "/team/all-team-members",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "Add New Team Member",
        path: "/team/add-team-member",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
    ],
  },
  {
    id: 2,
    name: "Projects",
    module_id: 1,
    path: "",
    Icon: <AiOutlineTransaction size={20} />,
    sub: [
      {
        id: 1,
        name: "All Projects",
        path: "/projects/all-projects",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "Add New Project",
        path: "/projects/add-project",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
    ],
  },
  {
    id: 3,
    name: "Task",
    module_id: 1,
    path: "",
    Icon: <AiOutlineTransaction size={20} />,
    sub: [
      {
        id: 1,
        name: "All Tasks",
        path: "/tasks/all-tasks",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "Add New Task",
        path: "/tasks/add-task",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
    ],
  },
  {
    id: 4,
    name: "task-auto-reassign-flow",
    module_id: 1,
    path: "",
    Icon: <AiOutlineTransaction size={20} />,
    sub: [
      {
        id: 1,
        name: "All Tasks",
        path: "/tasks/task-auto-reassign-flow",
        module_id: 1,
        Icon: <MdFormatListNumbered size={20} />,
      },
      {
        id: 2,
        name: "Add task-auto-reassign-flow",
        path: "/tasks/add-task-auto-reassign-flow",
        module_id: 1,
        Icon: <FaSellcast size={20} />,
      },
    ],
  },
];
