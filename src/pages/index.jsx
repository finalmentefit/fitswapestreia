import Layout from "./Layout.jsx";

import Home from "./Home.jsx";
import CreateStory from "./CreateStory.jsx";
import ViewStories from "./ViewStories.jsx";
import CreatePost from "./CreatePost (1).jsx";
import Profile from "./Profile.jsx";
import Notifications from "./Notifications.jsx";
import Explore from "./Explore.jsx";
import EditProfile from "./EditProfile.jsx";
import Settings from "./Settings.jsx";
import UserProfile from "./UserProfile.jsx";
import Followers from "./Followers.jsx";
import BusinessSetup from "./BusinessSetup (1).jsx";
import BecomeInstructor from "./BecomeInstructor.jsx";
import InstructorDashboard from "./InstructorDashboard.jsx";
import MarketplacePlans from "./MarketplacePlans.jsx";
import Challenges from "./Challenges.jsx";
import CreatePlan from "./CreatePlan.jsx";
import PlanDetails from "./PlanDetails.jsx";
import CreateChallenge from "./CreateChallenge (1).jsx";
import StudentChat from "./StudentChat.jsx";
import MySubscriptions from "./MySubscriptions.jsx";
import LogWorkout from "./LogWorkout.jsx";
import WorkoutHistory from "./WorkoutHistory.jsx";
import ChallengeProof from "./ChallengeProof.jsx";
import InstructorAnalytics from "./InstructorAnalytics (1).jsx";
import Communities from "./Communities (1).jsx";
import ManageAds from "./ManageAds.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import PermissionsHelp from "./PermissionsHelp.jsx";
import CommunityView from "./CommunityView.jsx";
import AccountTypeSelector from "./AccountTypeSelector.jsx";
import InstructorPanel from "./InstructorPanel.jsx";
import TermsOfService from "./TermsOfService.jsx";
import DirectMessages from "./DirectMessages.jsx";
import ManageCommunityMembers from "./ManageCommunityMembers.jsx";
import EditCommunity from "./EditCommunity.jsx";
import InstructorChat from "./InstructorChat.jsx";
import CreateWorkoutPlan from "./CreateWorkoutPlan.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Home: Home,
    CreateStory: CreateStory,
    ViewStories: ViewStories,
    CreatePost: CreatePost,
    Profile: Profile,
    Notifications: Notifications,
    Explore: Explore,
    EditProfile: EditProfile,
    Settings: Settings,
    UserProfile: UserProfile,
    Followers: Followers,
    BusinessSetup: BusinessSetup,
    BecomeInstructor: BecomeInstructor,
    InstructorDashboard: InstructorDashboard,
    MarketplacePlans: MarketplacePlans,
    Challenges: Challenges,
    CreatePlan: CreatePlan,
    PlanDetails: PlanDetails,
    CreateChallenge: CreateChallenge,
    StudentChat: StudentChat,
    MySubscriptions: MySubscriptions,
    LogWorkout: LogWorkout,
    WorkoutHistory: WorkoutHistory,
    ChallengeProof: ChallengeProof,
    InstructorAnalytics: InstructorAnalytics,
    Communities: Communities,
    ManageAds: ManageAds,
    PrivacyPolicy: PrivacyPolicy,
    PermissionsHelp: PermissionsHelp,
    CommunityView: CommunityView,
    AccountTypeSelector: AccountTypeSelector,
    InstructorPanel: InstructorPanel,
    TermsOfService: TermsOfService,
    DirectMessages: DirectMessages,
    ManageCommunityMembers: ManageCommunityMembers,
    EditCommunity: EditCommunity,
    InstructorChat: InstructorChat,
    CreateWorkoutPlan: CreateWorkoutPlan,
    WelcomeScreen: WelcomeScreen,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/CreateStory" element={<CreateStory />} />
                <Route path="/ViewStories" element={<ViewStories />} />
                <Route path="/CreatePost" element={<CreatePost />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Notifications" element={<Notifications />} />
                <Route path="/Explore" element={<Explore />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/UserProfile" element={<UserProfile />} />
                <Route path="/Followers" element={<Followers />} />
                <Route path="/BusinessSetup" element={<BusinessSetup />} />
                <Route path="/BecomeInstructor" element={<BecomeInstructor />} />
                <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
                <Route path="/MarketplacePlans" element={<MarketplacePlans />} />
                <Route path="/Challenges" element={<Challenges />} />
                <Route path="/CreatePlan" element={<CreatePlan />} />
                <Route path="/PlanDetails" element={<PlanDetails />} />
                <Route path="/CreateChallenge" element={<CreateChallenge />} />
                <Route path="/StudentChat" element={<StudentChat />} />
                <Route path="/MySubscriptions" element={<MySubscriptions />} />
                <Route path="/LogWorkout" element={<LogWorkout />} />
                <Route path="/WorkoutHistory" element={<WorkoutHistory />} />
                <Route path="/ChallengeProof" element={<ChallengeProof />} />
                <Route path="/InstructorAnalytics" element={<InstructorAnalytics />} />
                <Route path="/Communities" element={<Communities />} />
                <Route path="/ManageAds" element={<ManageAds />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/PermissionsHelp" element={<PermissionsHelp />} />
                <Route path="/CommunityView" element={<CommunityView />} />
                <Route path="/AccountTypeSelector" element={<AccountTypeSelector />} />
                <Route path="/InstructorPanel" element={<InstructorPanel />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
                <Route path="/DirectMessages" element={<DirectMessages />} />
                <Route path="/ManageCommunityMembers" element={<ManageCommunityMembers />} />
                <Route path="/EditCommunity" element={<EditCommunity />} />
                <Route path="/InstructorChat" element={<InstructorChat />} />
                <Route path="/CreateWorkoutPlan" element={<CreateWorkoutPlan />} />
                <Route path="/WelcomeScreen" element={<WelcomeScreen />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
