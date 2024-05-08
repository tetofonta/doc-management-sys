from glob import glob
from uuid import uuid1
from requests import post

def req(url, data):
    x = post(url, headers={"Content-Type": "application/json", "X-TYPESENSE-API-KEY": "LOL1234"}, json=data)
    if x.ok:
        print(f"OK {url}")
        return

    print(f"ERR {url} {x.status_code} {x.text} {data}")
    assert False

mesh = []

for f in glob("files/*.txt"):
    with open(f, "r") as ff:
        content = ff.read().split("\n")

    metadata = {
        "id": str(uuid1()),
        "type": "pdf",
        "group_can_edit": True,
        "group_can_delete": True,
        "group_can_read": True,
    }

    if len(mesh) < 5:
        mesh.append(metadata['id'])

    tags = []
    contents = []

    for line in content:
        type, data = line.split(":", 1)
        data = data.strip()
        if type == "Title":
            metadata["title"] = data[1:-1].strip()
            contents.append({
                "ref": metadata["id"],
                "chunk": data.strip()[1:-1],
                "chunk_type": "title"
            })
        elif type == "Category":
            metadata["category"] = data.lower().replace(" ", "_").strip()
        elif type == "User":
            metadata["owner"] = data.strip()
        elif type == "Group":
            metadata["group"] = data.strip()
        elif type == "Tags":
            for t in data.split(","):
                tags.append({
                    "tag": t.strip(),
                    "ref": metadata["id"]
                })
        elif type == "Content" or type == "Summary":
            count = 0
            for t in data.split(". "):
                contents.append({
                    "ref": metadata["id"],
                    "chunk": t.strip(),
                    "chunk_type": type.lower(),
                    "offset": count
                })
                count += len(t)

    req("http://localhost:8108/collections/metadata/documents", metadata)
    for tag in tags:
        req("http://localhost:8108/collections/tag/documents", tag)
    for c in contents:
        req("http://localhost:8108/collections/content/documents", c)

for i in range(len(mesh)):
    for j in range(i+1, len(mesh)):
        req("http://localhost:8108/collections/association/documents", {
            "src": mesh[i],
            "dest": mesh[j]
        })
        req("http://localhost:8108/collections/association/documents", {
            "src": mesh[j],
            "dest": mesh[i]
        })
