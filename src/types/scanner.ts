export type ScannerProps = {
    onScanSuccess: (result: string) => void;
    onError: (error: string) => void;
    onClose: () => void;
};