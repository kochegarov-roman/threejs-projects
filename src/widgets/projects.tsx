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
  return (
    <div
      id="projects"
      className="gap-2 md:gap-4 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {projectsInfo.map((project) => (
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
            {!project.external && project.codeHref && (
              <Link href={project.codeHref ?? '#'} target="_blank">
                <Button variant="ghost">Code</Button>
              </Link>
            )}

            <Link
              href={project.href ?? '#'}
              target={project.isExternal ? '_blank' : '_self'}
            >
              <Button variant="outline" className={'js-show-project'}>
                Show
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
