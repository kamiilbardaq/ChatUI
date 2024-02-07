import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

export type IMessageStatus = 'pending' | 'sent' | 'fail' | 'read';

type StatusType = '' | 'loading' | 'fail';

export interface MessageStatusProps {
  status: IMessageStatus;
  delay?: number;
  maxDelay?: number;
  onRetry?: () => void;
  onChange?: (type: StatusType) => void;
}

export const MessageStatus = ({
  status,
  delay = 1500,
  maxDelay = 5000,
  onRetry,
  onChange,
}: MessageStatusProps) => {
  const [type, setType] = useState<StatusType>('');
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const failTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const doTimeout = useCallback(() => {
    loadingTimerRef.current = setTimeout(() => {
      setType('loading');
    }, delay);

    failTimerRef.current = setTimeout(() => {
      setType('fail');
    }, maxDelay);
  }, [delay, maxDelay]);

  function clear() {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    if (failTimerRef.current) {
      clearTimeout(failTimerRef.current);
    }
  }

  useEffect(() => {
    clear();
    if (status === 'pending') {
      doTimeout();
    } else if (status === 'sent') {
      setType('sent');
    } else if (status === 'fail') {
      setType('fail');
    } else if (status === 'read') {
      setType('read');
    }

    return clear;
  }, [status, doTimeout]);

  useEffect(() => {
    if (onChange) {
      onChange(type);
    }
  }, [onChange, type]);

  function handleRetry() {
    setType('loading');
    doTimeout();
    if (onRetry) {
      onRetry();
    }
  }

  if (type) {
    return (
      <div className="MessageStatus" data-status={type}>
        {switch (type) {
          case 'fail':
            return <IconButton icon="warning-circle-fill" onClick={handleRetry} />
          
          case 'read':
            return <IconButton icon="check-circle-fill"/>
            
          case 'sent':
            return <IconButton icon="check"/>

          case 'spinner':
            return <IconButton icon="check"/>
        
          default:
            break;
        }}
      </div>
    );
  }

  return null;
};
