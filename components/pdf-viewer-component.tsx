import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// 配置PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// 抑制PDF.js的AbortException警告
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = function (msg, ...args) {
    if (
      typeof msg === "string" &&
      (msg.includes("AbortException: TextLayer task cancelled") ||
        msg.includes("TextLayer styles not found"))
    ) {
      // 忽略TextLayer相关的警告
      return;
    }
    originalConsoleError(msg, ...args);
  };
}

interface PDFViewerComponentProps {
  pdfPath: string;
}

const PDFViewerComponent: React.FC<PDFViewerComponentProps> = ({ pdfPath }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Save scroll position before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("pdfViewerScrollPosition", String(window.scrollY));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Restore scroll position on initial load
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("pdfViewerScrollPosition");
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      if (!isNaN(position)) {
        scrollPositionRef.current = position; // Store it in ref for later use
        // Delay scrolling until after potential layout shifts
        setTimeout(() => {
          window.scrollTo(0, position);
        }, 100); // Adjust delay as needed
        // Clean up session storage
        sessionStorage.removeItem("pdfViewerScrollPosition");
      }
    }
  }, []);

  // 添加调整大小的处理函数
  useEffect(() => {
    const updateContainerWidth = () => {
      if (viewerRef.current) {
        setContainerWidth(viewerRef.current.clientWidth);
      }
    };

    // 初始化时设置宽度
    updateContainerWidth();

    // 添加窗口调整大小事件监听器
    window.addEventListener("resize", updateContainerWidth);

    // 清理函数
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error): void {
    setError(error);
    setLoading(false);
  }

  // 使用节流函数来处理页面切换
  const changePage = (newPageNumber: number) => {
    if (pageChangeTimeoutRef.current) {
      clearTimeout(pageChangeTimeoutRef.current);
    }

    // 保存当前滚动位置
    scrollPositionRef.current = window.scrollY;

    pageChangeTimeoutRef.current = setTimeout(() => {
      setPageNumber(newPageNumber);

      // 在页面渲染后恢复滚动位置
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 50);
    }, 100); // 100ms的延迟，防止快速连续点击
  };

  function previousPage() {
    if (pageNumber <= 1) return;
    const newPageNumber = Math.max(pageNumber - 1, 1);
    changePage(newPageNumber);
  }

  function nextPage() {
    if (!numPages || pageNumber >= numPages) return;
    const newPageNumber = Math.min(pageNumber + 1, numPages);
    changePage(newPageNumber);
  }

  // 在页面渲染后恢复滚动位置
  useEffect(() => {
    // Restore scroll position after page change (if not already handled by initial load)
    if (!loading && scrollPositionRef.current > 0) {
      // Check if initial load already handled scroll restoration
      const savedPosition = sessionStorage.getItem("pdfViewerScrollPosition");
      if (!savedPosition) {
        // Use a slightly longer delay after page change compared to initial load
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 150);
      }
    }
  }, [pageNumber, loading]);

  // 清理超时
  useEffect(() => {
    return () => {
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // 处理鼠标进入和离开事件
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // 处理触摸事件 - 特别是针对移动设备
  const handleTouchStart = () => {
    setIsTouching(true);

    // 在触摸后5秒自动隐藏控制器
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setIsTouching(false);
    }, 5000);
  };

  return (
    <div
      className="border border-gray-200 shadow-md mb-4 rounded-lg overflow-hidden relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      ref={viewerRef}
    >
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="p-4 text-center">文档加载中...</div>}
        error={
          <div className="p-4 text-center text-red-500">
            加载PDF时出错: {error?.message}
          </div>
        }
        className="flex justify-center"
      >
        {!loading && !error && (
          <Page
            key={`page_${pageNumber}`} // 添加key以确保页面变化时组件重新渲染
            pageNumber={pageNumber}
            width={containerWidth || undefined}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex justify-center items-center p-10">
                页面加载中...
              </div>
            }
            error="页面加载失败"
            className="max-w-full"
          />
        )}
      </Document>

      {/* 分页控制按钮 - 放在PDF内部底部，并确保较高的z-index */}
      {numPages && (
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
            isHovering || isTouching ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 1000 }} // 确保较高的z-index
        >
          <div className="flex items-center justify-center bg-white bg-opacity-90 rounded-full shadow-md px-4 py-2">
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none cursor-pointer"
              aria-label="上一页"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <span className="mx-3 text-sm text-gray-700 font-medium">
              {pageNumber} of {numPages}
            </span>

            <button
              onClick={nextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none cursor-pointer"
              aria-label="下一页"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewerComponent;
