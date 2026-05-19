import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { Badge, Panel } from "@/components/Ui";
import { getAuditList, deleteTask, downloadHtmlReport } from "@/api/audit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import message from "@/components/Message";

const typeMap = {
    PENDING: { label: "待开始", tone: "slate" },
    SCANNING: { label: "扫描中", tone: "blue" },
    ANALYZING: { label: "分析中", tone: "amber" },
    COMPLETED: { label: "已完成", tone: "emerald" },
    FAILED: { label: "失败", tone: "red" },
};

const statusOptions = [
    { value: "", label: "全部状态" },
    { value: "PENDING", label: "待开始" },
    { value: "SCANNING", label: "扫描中" },
    { value: "ANALYZING", label: "分析中" },
    { value: "COMPLETED", label: "已完成" },
    { value: "FAILED", label: "失败" },
];

const IconView = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const IconDownload = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const IconDelete = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

const ActionButton = ({ title, onClick, variant = "default", children }) => {
    const variants = {
        default: "border-white/10 text-slate-400 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300",
        danger: "border-white/10 text-slate-400 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300",
    };

    return (
        <button
            title={title}
            onClick={onClick}
            className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

const fetchData = async (pageParams) => {
    const res = await getAuditList(pageParams);
    return res;
};

const AuditList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [pageParams, setPageParams] = useState({ page: 1, size: 10 });
    const [status, setStatus] = useState("");

    const queryParams = { ...pageParams, ...(status ? { status } : {}) };

    const { data: tasks, isLoading } = useQuery({
        queryKey: ["auditList", queryParams],
        queryFn: () => fetchData(queryParams),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteTask(id),
        onSuccess: () => {
            message.success("删除成功");
            queryClient.invalidateQueries({ queryKey: ["auditList"] });
        },
        onError: (err) => {
            message.error("删除失败: " + (err.message || "未知错误"));
        },
    });

    const downloadMutation = useMutation({
        mutationFn: (id) => downloadHtmlReport(id),
        onSuccess: (res) => {
            const html = typeof res === 'string' ? res : res?.data ?? res;
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        },
        onError: () => {
            message.error("下载报告失败");
        },
    });

    const total = tasks?.total ?? 0;
    const totalPages = Math.ceil(total / pageParams.size) || 1;
    const currentPage = tasks?.page ?? pageParams.page;

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setPageParams((prev) => ({ ...prev, page }));
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPageParams((prev) => ({ ...prev, page: 1 }));
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("确定要删除此审计任务吗？此操作不可恢复。")) {
            deleteMutation.mutate(id);
        }
    };

    const handleDownload = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        downloadMutation.mutate(id);
    };

    return (
        <AppShell
            eyebrow="Audit Tasks"
            title="审计任务列表"
            description="集中管理安全审计任务、AI 分析进度、风险分级与复核责任人。"
        >
            <Panel
                title="任务队列"
                subtitle="支持按状态筛选"
            >
                <div className="mb-5 grid gap-3 md:grid-cols-4">
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="min-h-11 cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-left text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                    >
                        {statusOptions.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-slate-900 text-slate-200"
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="grid grid-cols-[100px_1fr_90px_90px_90px_100px_120px] bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span>编号</span>
                        <span>任务名称</span>
                        <span className="text-center">总文件</span>
                        <span className="text-center">已扫描</span>
                        <span className="text-center">漏洞</span>
                        <span className="text-center">状态</span>
                        <span className="text-center">操作</span>
                    </div>
                    {isLoading && (
                        <div className="px-4 py-12 text-center text-sm text-slate-500">
                            加载中...
                        </div>
                    )}
                    {!isLoading && !tasks?.data?.records?.length && (
                        <div className="px-4 py-12 text-center text-sm text-slate-500">
                            暂无审计任务
                        </div>
                    )}
                    {tasks?.data?.records?.map((task) => {
                        const st = typeMap[task.status] ?? { label: task.status, tone: "slate" };
                        return (
                            <div
                                key={task.id}
                                className="group grid grid-cols-[100px_1fr_90px_90px_90px_100px_120px] items-center border-t border-white/10 px-4 py-3 text-sm transition hover:bg-white/[0.04]"
                            >
                                <Link
                                    to={`/audit/report-detail/${task.id}`}
                                    className="font-mono text-blue-200 hover:underline"
                                >
                                    {task.id}
                                </Link>
                                <Link
                                    to={`/audit/report-detail/${task.id}`}
                                    className="min-w-0"
                                >
                                    <span className="block truncate font-medium text-white">
                                        {task.projectName}
                                    </span>
                                    {task.errorMessage && (
                                        <span className="mt-0.5 block truncate text-xs text-red-400/70">
                                            {task.errorMessage}
                                        </span>
                                    )}
                                </Link>
                                <span className="text-center text-slate-300">{task.totalFiles ?? "-"}</span>
                                <span className="text-center text-slate-300">{task.scannedFiles ?? "-"}</span>
                                <span className={`text-center font-semibold ${(task.vulnCount ?? 0) > 0 ? "text-red-300" : "text-emerald-300"}`}>
                                    {task.vulnCount ?? 0}
                                </span>
                                <span className="flex justify-center">
                                    <Badge tone={st.tone}>{st.label}</Badge>
                                </span>
                                <span className="flex items-center justify-center gap-1.5">
                                    <ActionButton
                                        title="查看详情"
                                        onClick={() => navigate(`/audit/report-detail/${task.id}`)}
                                    >
                                        <IconView />
                                    </ActionButton>
                                    <ActionButton
                                        title="下载 HTML 报告"
                                        onClick={(e) => handleDownload(e, task.id)}
                                    >
                                        <IconDownload />
                                    </ActionButton>
                                    <ActionButton
                                        title="删除任务"
                                        variant="danger"
                                        onClick={(e) => handleDelete(e, task.id)}
                                    >
                                        <IconDelete />
                                    </ActionButton>
                                </span>
                            </div>
                        );
                    })}
                </div>
                {total > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            共 {total} 条，第 {currentPage}/{totalPages} 页
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="min-h-9 cursor-pointer rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                上一页
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => {
                                    if (totalPages <= 5) return true;
                                    if (p === 1 || p === totalPages) return true;
                                    return Math.abs(p - currentPage) <= 1;
                                })
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                        acc.push("...");
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === "..." ? (
                                        <span
                                            key={`ellipsis-${idx}`}
                                            className="px-1 text-sm text-slate-600"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => goToPage(item)}
                                            className={`min-h-9 min-w-9 cursor-pointer rounded-xl border px-3 text-sm transition focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
                                                item === currentPage
                                                    ? "border-blue-500/40 bg-blue-500/20 text-blue-200"
                                                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="min-h-9 cursor-pointer rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                下一页
                            </button>
                        </div>
                    </div>
                )}
            </Panel>
        </AppShell>
    );
};

export default AuditList;
