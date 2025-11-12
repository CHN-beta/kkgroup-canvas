'use client';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { Jimp } from 'jimp';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Receipt from '@/components/receipt';
import { Button } from '@/components/ui/button';
import { memoBirdPrint } from '@/lib/memobird';
import { useCheckinStore } from '@/lib/store';

export default function ReceiptPage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);
  const innerReceiptRef = useRef<HTMLDivElement>(null);
  const { attendeeName, orderId, clearCheckin } = useCheckinStore();

  useEffect(() => {
  }, [attendeeName, orderId, router]);

  const handleNewCheckin = () => {
    clearCheckin();
    router.push('/');
  };

  const downloadPng = async () => {
    if (receiptRef.current) {
      try {
        const blob = await domtoimage.toBlob(receiptRef.current, {
          bgcolor: '#ffffff',
        });
        saveAs(blob, `receipt-${orderId}.png`);
      }
      catch (error) {
        console.error('下载PNG失败:', error);
        toast.error('下载失败，请重试');
      }
    }
  };

  const triggerPrint = async () => {
    try {
      const key = 'attendee-log';
      const prev = localStorage.getItem(key) || '';
      const line = `${attendeeName},${orderId}\n`;
      localStorage.setItem(key, prev + line);
    } catch (e) {
      console.error('保存失败', e);
    }
    if (innerReceiptRef.current) {
      try {
        const dataUrl = await domtoimage.toPng(innerReceiptRef.current, {
          bgcolor: '#ffffff',
        });
        const jimpImage = await Jimp.read(dataUrl);
        memoBirdPrint(jimpImage);
        toast.success('打印任务已发送');
      }
      catch (error) {
        console.error('打印失败:', error);
        toast.error('打印失败，请重试');
      }
    }
  };

  // 固定的菜单项目，不允许修改
  const fixedMenuItems = [
    {
      type: 'item' as const,
      quantity: 2,
      name: 'wafer 威化饼干',
    },
    {
      type: 'separator' as const,
    },
    {
      type: 'item' as const,
      quantity: 1,
      name: '武汉热 GaN 面',
      comment: '没有胡萝卜缺陷',
    },
    {
      type: 'separator' as const,
    },
    {
      type: 'item' as const,
      quantity: 1,
      name: 'u-LED 三色小蛋糕',
      comment: '水源取自天然 quantum well',
    },
    {
      type: 'separator' as const,
    },
    {
      type: 'item' as const,
      quantity: 1,
      name: 'vdW 千层酥',
    },
    {
      type: 'separator' as const,
    },
    {
      type: 'separator' as const,
    },
    {
      type: 'item' as const,
      quantity: 1,
      name: '（赠品）h-BN 水乳眼霜套装',
      comment: '含 ODR 化妆镜',
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">签到成功！</h1>
        </div>

        <div
          className="flex justify-center bg-white px-[32px] pt-[16px] pb-[30px]"
          ref={receiptRef}
        >
          <Receipt
            ref={innerReceiptRef}
            header={{
              orderType: '堂食',
              orderId: attendeeName,
            }}
            menuItems={fixedMenuItems}
            deliveryOptions={{
              method: '柜台取餐',
              orderId: orderId.toString(),
              barcodeContent: 's.chn.moe/k',
            }}
            footer={{
              signature: 'KK Group 2025',
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <Button onClick={downloadPng} variant="outline" className="flex-1" size="lg">
              下载 PNG
            </Button>
            <Button onClick={triggerPrint} variant="outline" className="flex-1" size="lg">
              打印
            </Button>
          </div>

          <Button onClick={handleNewCheckin} className="w-full" size="lg">
            继续签到其他参与者
          </Button>
        </div>
      </div>
    </div>
  );
}
