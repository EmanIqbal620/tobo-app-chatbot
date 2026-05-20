y of 'src/utils/wcag21AATester.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tailwind.config.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.env.example', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.env.huggingface', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.env.local', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.env.production', LF will be replaced by CRLF the next time Git touches it

C:\Users\emani\OneDrive\Desktop\hugging-face-fronted\Todo-app-fronted\frontend>git commit -m "adding"
[main 0dc4c33] adding
 17 files changed, 281 insertions(+), 189 deletions(-)
 create mode 100644 .env.example
 create mode 100644 .env.huggingface
 create mode 100644 .env.local
 create mode 100644 .env.production

C:\Users\emani\OneDrive\Desktop\hugging-face-fronted\Todo-app-fronted\frontend>git push
Enumerating objects: 52, done.
Counting objects: 100% (52/52), done.
Delta compression using up to 4 threads
Compressing objects: 100% (26/26), done.
Writing objects: 100% (28/28), 29.81 KiB | 406.00 KiB/s, done.
Total 28 (delta 21), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (21/21), completed with 21 local objects.
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote:
remote: - GITHUB PUSH PROTECTION
remote:   —————————————————————————————————————————
remote:     Resolve the following violations before pushing again
remote:
remote:     - Push cannot contain secrets
remote:
remote:
remote:      (?) Learn how to resolve a blocked push
remote:      https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push
remote:
remote:
remote:       —— OpenRouter API Key ————————————————————————————————
remote:        locations:
remote:          - commit: 0dc4c3332c64862491c164f9561c3627b3d27762
remote:            path: .env.production:5
remote:
remote:        (?) To push, remove secret from commit(s) or follow this URL to allow the secret.
remote:        https://github.com/EmanIqbal620/tobo-app-chatbot/security/secret-scanning/unblock-secret/3DxL70hMgZJHl4RDplGnLFkJKtx
remote:
remote:
remote:
To https://github.com/EmanIqbal620/tobo-app-chatbot.git
 ! [remote rejected] main -> main (push declined due to repository rule violations)
error: failed to push some refs to 'https://github.com/EmanIqbal620/tobo-app-chatbot.git'

C:\Users\emani\OneDrive\Desktop\hugging-face-fronted\Todo-app-fronted\frontend>git rm --cached .env
fatal: pathspec '.env' did not match any files

C:\Users\emani\OneDrive\Desktop\hugging-face-fronted\Todo-app-fronted\frontend>


