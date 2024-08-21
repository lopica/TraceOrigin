import Joyride from 'react-joyride';

export default function GuideTour ({step, ...props}) {
    return <Joyride steps={step} {...props} />
}