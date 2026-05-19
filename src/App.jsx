import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AuditList = lazy(() => import("./pages/Audit/List"));
const AuditUpload = lazy(() => import("./pages/Audit/Upload"));
const AuditDetail = lazy(() => import("./pages/Audit/Detail"));
const KnowledgeSearch = lazy(() => import("./pages/Knowledge/Search"));
const KnowledgeManagement = lazy(() => import("./pages/Knowledge/Management"));
const Report = lazy(() => import("./pages/Audit/Report"));
const Vulns = lazy(() => import("./pages/Audit/Vulns"));

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/audit">
                    <Route
                        index
                        element={<Navigate to="/audit/tasks" replace />}
                    />
                    <Route
                        path="tasks"
                        element={
                            <ProtectedRoute>
                                <AuditList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="upload"
                        element={
                            <ProtectedRoute>
                                <AuditUpload />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="report-detail/:id"
                        element={
                            <ProtectedRoute>
                                <AuditDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="report-detail/:id/report"
                        element={
                            <ProtectedRoute>
                                <Report />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="report-detail/:id/vulnerabilities"
                        element={
                            <ProtectedRoute>
                                <Vulns />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="/knowledge">
                    <Route
                        index
                        element={<Navigate to="/knowledge/search" replace />}
                    />
                    <Route
                        path="search"
                        element={
                            <ProtectedRoute>
                                <KnowledgeSearch />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="manage"
                        element={
                            <ProtectedRoute>
                                <KnowledgeManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
