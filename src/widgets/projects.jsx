import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import Video from '@/shared/ui/video';
import { projectsInfo } from '@/shared/constants';
import Link from 'next/link';

export const Projects = () => {
  return projectsInfo.map((project) => (
    <Card className="relative overflow-hidden" key={project.name}>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.tags.join(', ')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Video
          src={'/' + project.src}
          width="640"
          height="360"
          autoplay={true}
          loop={true}
        />
      </CardContent>
      <CardFooter className="flex justify-between absolute bottom-0 w-[100%]">
        {!project.external && <Button variant="ghost">Code</Button>}
        <Button variant="outline">
          <Link href={project.href ?? '#'}>Show</Link>
        </Button>
      </CardFooter>
    </Card>
  ));
};
