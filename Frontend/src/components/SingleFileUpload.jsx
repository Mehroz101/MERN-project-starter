import  { useRef, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const SingleFileUpload = forwardRef(
  (
    {
      value = null,
      onChange,
      accept = "image/*",
      error = false,
      errorMessage = "Please select a file",
      chooseBtnLabel = "Choose File...",
      changeBtnLabel = "Change File...",
      removeBtnLabel = "Remove",
      preview = true,
      height = "8rem",
      background = "",
      className = "",
      previewUrl = null, // <-- add previewUrl prop
    },
    ref
  ) => {
    const [file, setFile] = useState(value);
    const [previewUrlState, setPreviewUrlState] = useState(null);
    const inputRef = useRef();
    const prevUrlRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getFile: () => file,
      setFile: (f) => setFile(f),
      removeFile: () => setFile(null),
    }));

    useEffect(() => {
      if (value !== file) setFile(value);
    }, [value, file]);

    useEffect(() => {
      if (file && file.type && file.type.startsWith("image")) {
        const url = URL.createObjectURL(file);
        setPreviewUrlState(url);
        // Only revoke the previous URL, not the current one
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }
        prevUrlRef.current = url;
      } else {
        setPreviewUrlState(null);
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
          prevUrlRef.current = null;
        }
      }
      // Cleanup on unmount
      return () => {
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
          prevUrlRef.current = null;
        }
      };
    }, [file]);

    // Show previewUrl prop if no file is selected
    const showPreviewUrl = !file && previewUrl;

    return (
      <div
        className={`flex flex-column gap-2 p-2 ${className}`}
        style={{
          minHeight: height,
          border: "dashed",
          borderRadius: ".5rem",
          borderColor: error ? "red" : "#ccc",
          background,
          position: "relative",
        }}
      >
        {error && (
          <span className="text-red-500 text-xs font-bold">{errorMessage}</span>
        )}
        <div className="flex align-items-center gap-2">
          <Button
            label={file ? changeBtnLabel : chooseBtnLabel}
            icon="pi pi-plus"
            onClick={() => inputRef.current?.click()}
            type="button"
            className="p-button-sm"
          />
          {file && (
            <Button
              label={removeBtnLabel}
              icon="pi pi-times"
              onClick={() => {
                setFile(null);
                setPreviewUrlState(null);
                if (onChange) onChange(null);
              }}
              type="button"
              className="p-button-sm p-button-danger"
            />
          )}
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
          accept={accept}
          onChange={e => {
            const f = e.target.files[0];
            setFile(f);
            if (onChange) onChange(f);
          }}
        />
        {preview && (previewUrlState || showPreviewUrl) && (
          <img
            src={previewUrlState || showPreviewUrl}
            alt="Preview"
            className="w-6rem h-6rem object-cover border-round mt-2"
            style={{ maxHeight: height }}
          />
        )}
        {file && !file.type?.startsWith("image") && (
          <span className="text-sm">{file.name}</span>
        )}
      </div>
    );
  }
);

SingleFileUpload.displayName = "SingleFileUpload";

SingleFileUpload.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.object,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  accept: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  chooseBtnLabel: PropTypes.string,
  changeBtnLabel: PropTypes.string,
  removeBtnLabel: PropTypes.string,
  preview: PropTypes.bool,
  height: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  previewUrl: PropTypes.string,
};

export default SingleFileUpload;
