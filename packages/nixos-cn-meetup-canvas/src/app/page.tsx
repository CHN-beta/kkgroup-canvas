'use client';

import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckinStore } from '@/lib/store';

let nextAttendeeId = 25000;

export default function Home() {
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeId, setAttendeeId] = useState(nextAttendeeId);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setCheckinInfo, isCheckedIn } = useCheckinStore();

  useEffect(() => {
    // 如果用户已经签到过，直接跳转到receipt页面
    if (isCheckedIn()) {
      router.push('/receipt');
    }
  }, [isCheckedIn, router]);

  const handleCheckin = async () => {
    setIsLoading(true);

    try {
      setCheckinInfo(attendeeName.trim(), attendeeId);
      nextAttendeeId = attendeeId + 1;
      router.push('/receipt');
    }
    catch (error) {
      console.error('获取订单ID失败:', error);
      toast.error('签到失败，请重试');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">NixOS CN Meetup #1</h1>
          <p className="text-lg">入场回执生成系统</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>🎉 欢迎参加活动！请输入您的姓名完成签到</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">参与者签到</CardTitle>
            <CardDescription>
              请输入您的姓名生成专属入场回执
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="attendee-name" className="text-base font-medium">
                签到人姓名
              </Label>
              <Input
                id="attendee-name"
                type="text"
                placeholder="请输入您的姓名"
                value={attendeeName}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={isLoading}
                onChange={(e) => {
                  setAttendeeName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleCheckin();
                  }
                }}
                className="text-lg py-6"
              />
              <Label htmlFor="attendee-id" className="text-base font-medium">
                取餐号
              </Label>
              <Input
                id="attendee-id"
                type="number"
                placeholder="请输入您的取餐号"
                value={attendeeId}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={isLoading}
                onChange={(e) => {
                  setAttendeeId(Number(e.target.value));
                }}
                className="text-lg py-6"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCheckin}
              className="w-full text-lg py-6"
//              disabled={!attendeeName.trim() || isLoading}
              size="lg"
            >
              {isLoading ? <Loader2Icon className="animate-spin" /> : null}
              🎫 生成入场回执
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
