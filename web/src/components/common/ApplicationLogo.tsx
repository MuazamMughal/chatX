import Image from 'next/image';

export default function ApplicationLogo() {
    return (
        <div className="mb-">
            <Image
                src="/chatx.png"
                alt="ChatX Logo"
                width={250}
                height={250}
                className="mx-auto mb-4 object-contain"
            />
        </div>
    );
}
