# Splits a full text file by double newlines and saves it to the same folder associating users and groups.



with open('files/file_data', "r") as data:
    files = data.read().split("\n\n")
    for i, f in enumerate(files):
        with open(f"files/{i}.txt", "w") as out:
            out.write(f)

            if 0 <= i < 10:
                out.write("\nUser: admin")
            elif 10 <= i < 20:
                out.write("\nUser: tetofonta")
            elif 20 <= i < 30:
                out.write("\nUser: notme")
            else:
                out.write("\nUser: nobody")

            if 30 <= i < 40:
                out.write("\nGroup: local_user")
            elif 40 <= i < 50:
                out.write("\nGroup: grouptwo")