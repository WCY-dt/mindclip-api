interface Env {
    MINDCLIP_DATA: D1Database;
    
    SECRET_KEY: string;
    USERNAME: string;
    PASSWORD: string;
}

interface dataProps {
    Id: number | undefined;
    Collection: string;
    Category: string;
    Title: string;
    Url: string;
    Description: string;
    Detail: string;
    links: linkProps[];
}

interface linkProps {
    Id: number | undefined;
    CardId: number | undefined;
    Title: string;
    Url: string;
}
